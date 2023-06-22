'use strict';

import { loadTasks } from './storage.js';


let tasks = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    // tasks = await loadTasks();
    addBoxEventListener();
    setGreetingName();
}

/**
 * Set click event listeners for the boxes. On click the user gets redirected to the board.
 */
function addBoxEventListener() {
    const boxElements = document.querySelectorAll('.box');

    boxElements.forEach(element => {
        element.addEventListener('click', () => location.pathname = '/board.html');
    });
}

/**
 * Sets the name of the greeting text to the username of the currently logged in user.
 */
function setGreetingName() {
    const greetingEl = document.getElementById('user');
    const name = localStorage.getItem('Join_current_user');

    greetingEl.innerText = name;
}


init();