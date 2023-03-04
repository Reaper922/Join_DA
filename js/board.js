/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await downloadFromServer();
    contacts = await loadItem('contacts');
    tasks = await loadItem('tasks');
    renderTaskItems(tasks);
    addSeachBarEventListener();
    addModalCloseEventListener();
}


function addDragItemEventListener() {
    const draggableItems = document.querySelectorAll('.task-item');
    const dropContainers = document.querySelectorAll('.task-col');

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', () => itemDragStartEvent(item, dropContainers));
        item.addEventListener('dragend', () => itemDragEndEvent(item, dropContainers));
        item.addEventListener('click', () => itemClickEvent(item));
    });
}


function itemDragStartEvent(item, dropContainers) {
    item.classList.add('dragging');
    dropContainers.forEach(container => container.classList.add('mark-drop'));
}


function itemDragEndEvent(item, dropContainers) {
    item.classList.remove('dragging');
    dropContainers.forEach(container => container.classList.remove('mark-drop'));
    updateItem(item);
}

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


function addDragContainerEventListener() {
    const dropContainers = document.querySelectorAll('.task-col');
    dropContainers.forEach(container => {
        container.addEventListener('dragover', event => containerDragOverEvent(event, container));
    });
}


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


function addSeachBarEventListener() {
    const searchBarInp = document.getElementById('search-task');

    searchBarInp.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            renderTaskItems(filterTasks(searchBarInp));
        }
    });
}

function addModalCloseEventListener() {
    const modalClose = document.getElementById('modal-close');
    const modal = document.getElementById('modal');

    modalClose.addEventListener('click', () => {
        modal.close();
    })
}


function filterTasks(searchBarInp) {
    const filteredTasks = tasks.filter(task => {
        const taskTitle = task.title.toLowerCase();
        const searchInput = searchBarInp.value.toLowerCase();
        return taskTitle.includes(searchInput);
    });
    searchBarInp.value = '';
    return filteredTasks;
}


async function updateItem(item) {
    const task = tasks.find(task => task.id === item.dataset.id);

    task.status = item.parentElement.dataset.category;
    await storeItem('tasks', tasks);
}


function renderTaskItems(tasksArr) {
    const toDoEl = document.getElementById('todo');
    const inProgressEl = document.getElementById('in-progress');
    const awaitingFeedbackEl = document.getElementById('awaiting-feedback');
    const doneEl = document.getElementById('done');

    clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl);

    for (task of tasksArr) {
        const assignees = renderAssignees(task.assignees);
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
}


function clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl) {
    toDoEl.innerHTML = taskColHeaderTemp('To Do');
    inProgressEl.innerHTML = taskColHeaderTemp('In Progress');
    awaitingFeedbackEl.innerHTML = taskColHeaderTemp('Awaiting Feedback');
    doneEl.innerHTML = taskColHeaderTemp('Done');
}


function renderAssignees(assignees) {
    let assigneesHTML = '';

    for (let i = 0; i < assignees.length; i++) {
        const contact = contacts.find(contact => contact.id === assignees[i]);
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


function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
}


function taskColHeaderTemp(title) {
    return (`
        <div class="task-col-header">
            <h5 class="txt-h5">${title}</h5>
            <img src="./assets/icons/task_button.svg" alt="" class="task-button" id="task-button" draggable="false">
        </div>
    `);
}


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


function assigneeHTMLTemp(initials, color, offset) {
    return (`
        <div class="assignee" style="right:${offset}px; background: hsl(${color}, 100%, 30%)">${initials}</div>
    `);
}


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
    `);
}


function modalAssigneHTMLTemp(initials, contact) {
    return (`
        <div class="modal-assignee d-flex">
            <div class="modal-assignee-initials" style="background:hsl(${contact.color}, 100%, 30%)">${initials}</div>
            <div>${contact.firstname} ${contact.lastname}</div>
        </div>
    `);
}

init();