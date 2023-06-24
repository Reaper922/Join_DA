'use strict';

import { loadTasks, loadContacts, } from './storage.js';
// import {  } from './templates.js';


let tasks = [];
let contacts = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    tasks = await loadTasks();
    contacts = await loadContacts();

    console.log(tasks);
    console.log(contacts);
}


onload = init();