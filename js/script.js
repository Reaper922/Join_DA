'use strict';


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await includeHTML();
    highlightActiveMenuItem();
    logoutMenuEventListener();
}

/**
 * Inserts the HTML from the template files into the referenced file.
 */
async function includeHTML() {
    const includeElements = document.querySelectorAll('[template-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element?.getAttribute("template-html");

        const resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * Highlights the active menu item after the page is loaded. The marking takes place on the basis of the current path.
 */
function highlightActiveMenuItem() {
    const currentPath = location.pathname;
    const legalEl = document.getElementById('legal-desktop');

    switch (currentPath) {
        case '/summary.html':
            addActiveClass('summary');
            break;
        case '/board.html':
            addActiveClass('board');
            break;
        case '/task.html':
            addActiveClass('task');
            break;
        case '/contacts.html':
            addActiveClass('contacts');
            break;
        case '/legal.html':
            legalEl?.classList.add('active-nav');
            break;
        default:
            break;
    }
}

/**
 * Adds the active class to the given element.
 * @param {String} element Name of the page.
 */
function addActiveClass(element) {
    const desktopEl = document.getElementById(`${element}-desktop`);
    const mobileEl = document.getElementById(`${element}-mobile`);

    desktopEl?.classList.add('active-nav');
    mobileEl?.classList.add('active-nav');
}

/**
 * Adds an event listener to the profile picture to toggle the logout menu.
 */
function logoutMenuEventListener() {
    const profilePicture = document.getElementById('profile-picture');
    const logoutMenu = document.getElementById('logout-menu');

    profilePicture?.addEventListener('click', () => {
        logoutMenu?.classList.toggle('d-none');
    });
}


init();