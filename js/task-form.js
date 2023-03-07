'use strict';


/**
 * Initial function that gets executed after the document is loaded.
 */
function initTask() {
    buttonEventListener();
    renderAssignees();
}


/**
 * Adds click event listeners to all listed elements
 */
function buttonEventListener() {
    const clearTaskBtn = document.getElementById('clear-task');
    const assigneeMenu = document.getElementById('assignee');

    assigneeMenu.addEventListener('click', toggleDropdown);
    clearTaskBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        clearInputFields();
    })
}


/**
 * Adds and stores the new task to the database.
 */
function addTask() {
    const createdWithStatus = document.getElementById('add-task-form').dataset.status;
    const id = Date.now().toString(36);
    const titleInp = document.getElementById('title');
    const descriptionInp = document.getElementById('description');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');
    const priorityInp = document.querySelector('input[name="priority"]:checked');
    const priority = priorityInp != null ? priorityInp.value : 'low';
    const assignees = [];
    const assigneeInp = document.querySelectorAll('.assignee input[type="checkbox"]:checked');
    assigneeInp.forEach(assignee => assignees.push(assignee.value));

    if (isInputValid(assignees)) {
        const task = {
            id: id,
            title: titleInp.value,
            description: descriptionInp.value,
            category: categoryInp.value,
            assignees: assignees,
            date: dateInp.value,
            priority: priority,
            status: createdWithStatus,
        }

        storeTasks(task);
    }
}


/**
 * Validates the user input.
 * @param {array} assignees Array of assignees.
 * @returns 
 */
function isInputValid(assignees) {
    const titleInp = document.getElementById('title');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');
    const assigneeCheck = document.getElementById('assignee-check');
    const isInputValid = titleInp.checkValidity() && categoryInp.checkValidity() && dateInp.checkValidity() && assignees.length > 0;
    assigneeCheck.checked = false;

    if (assignees.length === 0) {
        assigneeCheck.reportValidity()
    } else {
        assigneeCheck.checked = true;
    }
    return isInputValid;
}


/**
 * Clears the input fields of the form.
 */
function clearInputFields() {
    const titleInp = document.getElementById('title');
    const descriptionInp = document.getElementById('description');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');
    const assigneeInp = document.querySelectorAll('input[type="checkbox"]:checked');
    const priority = document.querySelector('input[name="priority"]:checked');

    titleInp.value = '';
    descriptionInp.value = '';
    categoryInp.value = '';
    assigneeInp.forEach(assignee => assignee.checked = false);
    dateInp.value = '';

    if (priority) {
        priority.checked = false;
    }
}


/**
 * Stores the task in the database and clears the input fields.
 * @param {object} task Task object.
 */
async function storeTasks(task) {
    tasks.push(task);
    await storeItem('tasks', tasks);
    clearInputFields();
    window.location.pathname = '/board.html';
}


/**
 * Toggles the custom dropdown menu for the assignees.
 */
function toggleDropdown() {
    const assigneeBackground = document.getElementById('assignee-background');
    const assigneeContainer = document.getElementById('assignee-container');

    assigneeBackground.classList.toggle('d-none');
    assigneeContainer.classList.toggle('d-none');
}


/**
 * Renders the assignees (all available contacts) into the dropdown selection.
 */
function renderAssignees() {
    const assigneeContainer = document.getElementById('assignee-container');

    assigneeContainer.innerHTML = '';
    contacts.forEach(contact => {
        assigneeContainer.innerHTML += assigneeTemp(contact);
    });
}


/**
 * HTML template for rendering the assignee.
 * @param {Object} contact Conact that should be rendered
 * @returns HTML assignee template
 */
function assigneeTemp(contact) {
    return `
        <label for="${contact.id}" class="assignee">${contact.firstname} ${contact.lastname}
            <input type="checkbox" name="${contact.id}"id="${contact.id}" value="${contact.id}">
            <span class="checkmark"></span>
        </label>`;
}