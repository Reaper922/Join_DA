'use strict';

import { notify } from './notification.js';


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    addSendBtnEventListener();
}

/**
 * Add a click event listener to the sned button and and displays a notification on click.
 */
function addSendBtnEventListener() {
    const sendBtn = document.getElementById('send');

    sendBtn?.addEventListener('click', () => notify('This function is not available in the prototype.'))
}


init();