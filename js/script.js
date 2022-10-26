'use strict';

window.onload = () => {
    includeHTML();
    // document.getElementById('header').classList.add('fade-in');
    // document.getElementById('main').classList.add('fade-in');
}


async function includeHTML() {
    const includeElements = document.querySelectorAll('[template-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("template-html");
        const resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

