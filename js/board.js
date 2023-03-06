'use strict';


let contacts = [];
let tasks = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await downloadFromServer();
    contacts = await loadItem('contacts');
    tasks = await loadItem('tasks');
    renderTaskItems(tasks);
    addSeachBarEventListener();
    addNewTaskEventListener();
    addModalCloseEventListener();
    initTask();
}


/**
 * Adds the event listener for the board item.
 */
function addDragItemEventListener() {
    const draggableItems = document.querySelectorAll('.task-item');
    const dropContainers = document.querySelectorAll('.task-col');

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', () => itemDragStartEvent(item, dropContainers));
        item.addEventListener('dragend', () => itemDragEndEvent(item, dropContainers));
        item.addEventListener('click', () => itemClickEvent(item));
    });
}


/**
 * Marks the dragging item and the drop containers.
 * @param {object} item Task object.
 * @param {array} dropContainers Array of drop containers.
 */
function itemDragStartEvent(item, dropContainers) {
    item.classList.add('dragging');
    dropContainers.forEach(container => container.classList.add('mark-drop'));
}


/**
 * Removes the marking and updates the item.
 * @param {object} item Task object.
 * @param {array} dropContainers Array of drop containers.
 */
function itemDragEndEvent(item, dropContainers) {
    item.classList.remove('dragging');
    dropContainers.forEach(container => container.classList.remove('mark-drop'));
    updateItem(item);
}


/**
 * Opens the board item modal on click.
 * @param {object} item Task object.
 */
function itemClickEvent(item) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const task = tasks.find(task => task.id === item.dataset.id);
    let assignees = '';

    task.assignees.forEach(assignee => {
        const contact = contacts.find(contact => contact.id === assignee);
        const firstnameChar = contact.firstname.charAt(0).toUpperCase();
        const lastnameChar = contact.lastname.charAt(0).toUpperCase();
        const initials = `${firstnameChar}${lastnameChar}`;
        assignees += modalAssigneHTMLTemp(initials, contact);
    })

    modalContent.innerHTML = modalItemHTMLTemp(task, assignees);
    modal.showModal()
}


/**
 * Adds the dragover event to each board column.
 */
function addDragContainerEventListener() {
    const dropContainers = document.querySelectorAll('.task-col');
    dropContainers.forEach(container => {
        container.addEventListener('dragover', event => containerDragOverEvent(event, container));
    });
}


/**
 * Dragover function for the board colums.
 * @param {object} event Dragover event object.
 * @param {HTMLElement} container Board column container.
 */
function containerDragOverEvent(event, container) {
    event.preventDefault();
    const afterElement = getDragAfterElement(container, event.clientY);
    const draggedItem = document.querySelector('.dragging');

    if (afterElement == null) {
        container.appendChild(draggedItem);
    } else {
        container.insertBefore(draggedItem, afterElement);
    }
}


/**
 * Gets the drag after element.
 * @param {HTMLElement} container Board column container.
 * @param {number} y Y mouse position.
 * @returns 
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


/**
 * Adds the keydown event listener to the search bar.
 */
function addSeachBarEventListener() {
    const searchBarInp = document.getElementById('search-task');

    searchBarInp.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            renderTaskItems(filterTasks(searchBarInp));
        }
    });
}


/**
 * Adds the click event to every button that should create a new task.
 */
function addNewTaskEventListener() {
    const newTaskBtn = document.getElementById('new-task-btn');
    const toDoTaskBtn = document.getElementById('todo-btn');
    const inProgressTaskBtn = document.getElementById('progress-btn');
    const awaitingTaskBtn = document.getElementById('awaiting-btn');
    const doneTaskBtn = document.getElementById('done-btn');
    const modalAddTask = document.getElementById('add-task-form');
    const modalTaskClose = document.getElementById('modal-task-close');

    newTaskBtn.addEventListener('click', () => openAddTaskModal('todo', modalAddTask));
    toDoTaskBtn.addEventListener('click', () => openAddTaskModal('todo', modalAddTask));
    inProgressTaskBtn.addEventListener('click', () => openAddTaskModal('progress', modalAddTask));
    awaitingTaskBtn.addEventListener('click', () => openAddTaskModal('awaiting', modalAddTask));
    doneTaskBtn.addEventListener('click', () => openAddTaskModal('done', modalAddTask));
    modalTaskClose.addEventListener('click', () => modalAddTask.close());
}


/**
 * Shows the add task modal and sets a data property with the desired status.
 * @param {string} status Status of the task.
 * @param {HTMLElement} modal Add task modal.
 */
function openAddTaskModal(status, modal) {
    modal.showModal();
    modal.dataset.status = status;
}


/**
 * Adds the click event listener to close the modal.
 */
function addModalCloseEventListener() {
    const modalClose = document.getElementById('modal-close');
    const modal = document.getElementById('modal');

    modalClose.addEventListener('click', () => {
        modal.close();
    })
}


/**
 * Filters the tasks array with the given promt and return a new array that contains the filtered tasks.
 * @param {string} searchBarInp Search input.
 * @returns Filtered tasks array.
 */
function filterTasks(searchBarInp) {
    const filteredTasks = tasks.filter(task => {
        const taskTitle = task.title.toLowerCase();
        const searchInput = searchBarInp.value.toLowerCase();
        return taskTitle.includes(searchInput);
    });
    searchBarInp.value = '';
    return filteredTasks;
}


/**
 * Updates the task in the database.
 * @param {HTMLElement} item Board item.
 */
async function updateItem(item) {
    const task = tasks.find(task => task.id === item.dataset.id);

    task.status = item.parentElement.dataset.category;
    await storeItem('tasks', tasks);
}


/**
 * Renders the tasks in the correct board column.
 * @param {array} tasksArr Array of task objects.
 */
function renderTaskItems(tasksArr) {
    const toDoEl = document.getElementById('todo');
    const inProgressEl = document.getElementById('in-progress');
    const awaitingFeedbackEl = document.getElementById('awaiting-feedback');
    const doneEl = document.getElementById('done');

    clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl);

    for (let task of tasksArr) {
        const assignees = renderTaskAssignees(task);
        switch (task.status) {
            case 'todo':
                toDoEl.innerHTML += taskItemHTMLTemp(task, assignees);
                break;
            case 'progress':
                inProgressEl.innerHTML += taskItemHTMLTemp(task, assignees);
                break;
            case 'awaiting':
                awaitingFeedbackEl.innerHTML += taskItemHTMLTemp(task, assignees);
                break;
            case 'done':
                doneEl.innerHTML += taskItemHTMLTemp(task, assignees);
                break;
            default:
                toDoEl.innerHTML += taskItemHTMLTemp(task, assignees);
        }
    }

    addDragItemEventListener();
    addDragContainerEventListener();
    addNewTaskEventListener();
}


/**
 * Clears the column elements and renders the headers.
 * @param {HTMLElement} toDoEl To do col element.
 * @param {HTMLElement} inProgressEl In progress col element.
 * @param {HTMLElement} awaitingFeedbackEl Awaiting feedback col element.
 * @param {HTMLElement} doneEl Done col element.
 */
function clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl) {
    toDoEl.innerHTML = taskColHeaderTemp('To Do', 'todo-btn');
    inProgressEl.innerHTML = taskColHeaderTemp('In Progress', 'progress-btn');
    awaitingFeedbackEl.innerHTML = taskColHeaderTemp('Awaiting Feedback', 'awaiting-btn');
    doneEl.innerHTML = taskColHeaderTemp('Done', 'done-btn');
}


/**
 * Renders the assignees of the board object.
 * @param {object} task Task object.
 * @returns String with rendered assignees.
 */
function renderTaskAssignees(task) {
    const assignees = task.assignees;
    let assigneesHTML = '';

    for (let i = 0; i < assignees.length; i++) {
        const contact = contacts.find(contact => contact.id === assignees[i]);
        if (!contact) { removeAssignee(task, assignees[i]); continue }
        const firstnameChar = contact.firstname.charAt(0).toUpperCase();
        const lastnameChar = contact.lastname.charAt(0).toUpperCase();
        const initials = `${firstnameChar}${lastnameChar}`;
        const assigneeOffset = i * 12;

        if (i == 3) {
            assigneesHTML += assigneeHTMLTemp(`+${assignees.length - i}`, contact.color, assigneeOffset);
            return assigneesHTML;
        } else {
            assigneesHTML += assigneeHTMLTemp(initials, contact.color, assigneeOffset);
        }
    }
    return assigneesHTML;
}


/**
 * Removes the assignee from a task.
 * @param {object} task Task object.
 * @param {string} assignees Assignee HTML template string.
 */
async function removeAssignee(task, assignee) {
    const assigneeIndex = task.assignees.indexOf(assignee);
    task.assignees.splice(assigneeIndex, 1);
    await storeItem('tasks', tasks);
}


/**
 * Deletes the task with the given id from the database.
 * @param {string} id Id of the task.
 */
function deleteTask(id) {
    const modal = document.getElementById('modal');
    const delTask = tasks.find(task => task.id === id);
    const delTaskIndex = tasks.indexOf(delTask);

    tasks.splice(delTaskIndex, 1);
    storeItem('tasks', tasks);
    renderTaskItems(tasks);
    notify('Successfully deleted!');
    modal.close();
}


// -------------------
// Templates
// -------------------

/**
 * Returns the HTML template for the board column header.
 * @param {string} title Title of the board column.
 * @param {string} id Id of the img element.
 * @returns 
 */
function taskColHeaderTemp(title, id) {
    return (`
        <div class="task-col-header">
            <h5 class="txt-h5">${title}</h5>
            <img src="./assets/icons/task_button.svg" alt="Add Task Icon" class="task-button" id="${id}" draggable="false">
        </div>
    `);
}


/**
 * Returns the HTML template for the board item.
 * @param {object} task Task object.
 * @param {string} assignees Assignee HTML template string.
 * @returns 
 */
function taskItemHTMLTemp(task, assignees) {
    return (`
        <div class="task-item" data-id="${task.id}" draggable="true">
            <div class="category">${task.category}</div>
            <div>
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
            <div class="task-footer">
                <div class="assignees">${assignees}</div>
                <div class="d-flex">
                    <img src="./assets/icons/${task.priority}.svg" alt="Priority Icon" class="priority" draggable="false">
                </div>
            </div>
        </div>
    `);
}


/**
 * Return the HTML template for the board item assignee.
 * @param {string} initials Initials of the contact.
 * @param {string} color Color for the initials bubble.
 * @param {number} offset Osset for the initials bubble.
 * @returns HTML assignee template.
 */
function assigneeHTMLTemp(initials, color, offset) {
    return (`
        <div class="assignee-task" style="right:${offset}px; background: hsl(${color}, 100%, 30%)">${initials}</div>
    `);
}


/**
 * Returns the HTML template for the item modal.
 * @param {object} task Task object.
 * @param {string} assignees Assignee HTML template string.
 * @returns HTML item template.
 */
function modalItemHTMLTemp(task, assignees) {
    return (`
        <div class="modal-category">${task.category}</div>
        <div>
            <div class="modal-title txt-h4">${task.title}</div>
            <div class="modal-description">${task.description}</div>
        </div>
        <div class="modal-date"><b>Due Date:&nbsp;</b>${formatDate(task.date)}</div>
        <div class="modal-priority"><b>Priority:&nbsp;</b>
            <p  style="background: var(--${task.priority})">${task.priority}
                <img src="./assets/icons/${task.priority}_white.svg" draggable="false">
            </p>
        </div>
        <div class="modal-assignees"><b>Assigned to:</b>
            <div class="modal-assignee-container d-flex-col">${assignees}</div>
        </div>
        <div>
            <button class="btn btn-primary" id="modal-delete" onclick="deleteTask('${task.id}')"><img src="./assets/icons/trash_white.svg"></button>
        </div>
    `);
}


/**
 * Returns the HTML template for the assignee dropdown.
 * @param {string} initials Initials of the contact.
 * @param {object} contact Contact object.
 * @returns HTML assignee template
 */
function modalAssigneHTMLTemp(initials, contact) {
    return (`
        <div class="modal-assignee d-flex">
            <div class="modal-assignee-initials" style="background:hsl(${contact.color}, 100%, 30%)">${initials}</div>
            <div>${contact.firstname} ${contact.lastname}</div>
        </div>
    `);
}

init();