'use strict';


let tasks =  [];
let contacts = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await downloadFromServer();
    contacts = await loadItem('contacts');
    tasks = await loadItem('tasks');
    buttonEventListener();
    renderAssignees();
    console.log(tasks);
}


/**
 * Adds click event listeners to all listed elements
 */
function buttonEventListener() {
    const addTaskBtn = document.getElementById('add-task');
    const clearTaskBtn = document.getElementById('clear-task');
    const assigneeMenu = document.getElementById('assignee');

    addTaskBtn?.addEventListener('click', (e) => {
        // e.preventDefault();
        addTask();
    })

    clearTaskBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        clearInputFields();
    })

    assigneeMenu.addEventListener('click', toggleDropdown);
}


async function addTask() {
    const titleInp = document.getElementById('title');
    const descriptionInp = document.getElementById('description');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');
    const id = Date.now().toString(36);

    const task = {
        id: id,
        title: titleInp.value,
        description: descriptionInp.value,
        category: categoryInp.value,
        assignees: [],
        date: dateInp.value,
        priority: 'low',
        status: 'todo',
    }

    tasks.push(task);
    await storeItem('tasks', tasks);
    clearInputFields();
    console.log(tasks);
    // window.location.pathname = '/board.html';
}


/**
 * Clears the input fields of the form.
 */
function clearInputFields() {
    const titleInp = document.getElementById('title');
    const descriptionInp = document.getElementById('description');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');

    titleInp.value = '';
    descriptionInp.value = '';
    categoryInp.value = '';
    dateInp.value = '';
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
    })
}


/**
 * HTML template for rendering the assignee.
 * @param {Object} contact Conact that should be rendered
 * @returns HTML assignee template
 */
function assigneeTemp(contact) {
    return `
        <label for="${contact.id}">${contact.firstname} ${contact.lastname}
            <input type="checkbox" name="${contact.id}" id="${contact.id}" value="${contact.id}">
            <span class="checkmark"></span>
        </label>`;
}



init();