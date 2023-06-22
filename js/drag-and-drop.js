'use strict';


/**
 * Initial function that gets executed after the document is loaded.
 */
function init() {
    addDragTaskEventListener();
    addDragContainerEventListener();
}


/**
 * Add event listener for the task item and task container.
 */
function addDragTaskEventListener() {
    const draggableItems = document.querySelectorAll('board-task');
    const dropContainers = document.querySelectorAll('.board-task-container');

    draggableItems.forEach(taskEl => {
        taskEl.addEventListener('dragstart', () => taskDragStartEvent(taskEl, dropContainers));
        taskEl.addEventListener('dragend', () => taskDragEndEvent(taskEl, dropContainers));
        taskEl.addEventListener('click', () => taskClickEvent(taskEl));
    });
}


/**
 * Add the dragover event to each task container.
 */
function addDragContainerEventListener() {
    const dropContainers = document.querySelectorAll('.board-task-container');
    dropContainers.forEach(container => {
        container.addEventListener('dragover', event => containerDragOverEvent(event, container));
    });
}


/**
 * Marks the dragging item and the task containers.
 * @param {HTMLElement} taskEl Task HTML Element.
 * @param {NodeList} dropContainers NodeList of drop containers.
 */
function taskDragStartEvent(taskEl, dropContainers) {
    taskEl.classList.add('dragging');
    dropContainers.forEach(container => container.classList.add('drop-area'));
}


/**
 * Removes the marking and updates the task.
 * @param {HTMLElement} taskEl Task HTML Element.
 * @param {NodeList} dropContainers NodeList of drop containers.
 */
function taskDragEndEvent(taskEl, dropContainers) {
    taskEl.classList.remove('dragging');
    dropContainers.forEach(container => container.classList.remove('drop-area'));
    // updateItem(taskEl); -> Update Item in DB
}


/**
 * Dragover function for the task container.
 * @param {Event} event Dragover event.
 * @param {HTMLElement} container Task container.
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
    const draggableElements = [...container.querySelectorAll('board-task:not(.dragging')];

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
 * Opens the board item modal on click.
 * @param {HTMLElement} item Task HTML Element.
 */
function taskClickEvent(item) {
    const taskModal = document.getElementById('dialog-task');
    taskModal.showModal()


    // const modalContent = document.getElementById('modal-content');
    // const task = tasks.find(task => task.id === item.dataset.id);
    // const subtasks = renderSubtasks(task);
    // let assignees = '';

    // task.assignees.forEach(assignee => {
    //     const contact = contacts.find(contact => contact.id === assignee);
    //     const firstnameChar = contact.firstname.charAt(0).toUpperCase();
    //     const lastnameChar = contact.lastname.charAt(0).toUpperCase();
    //     const initials = `${firstnameChar}${lastnameChar}`;
    //     assignees += modalAssigneHTMLTemp(initials, contact);
    // })

    // modalContent.innerHTML = modalItemHTMLTemp(task, assignees, subtasks);
    // setStatusSelect(task);
    // modal.showModal()
}


init();