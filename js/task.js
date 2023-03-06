'use strict';


let tasks = [];
let contacts = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await downloadFromServer();
    contacts = await loadItem('contacts');
    tasks = await loadItem('tasks');
    initTask();
}


init();