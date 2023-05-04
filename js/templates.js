'use strict';


export function contactSeparatorHTMLTemplate(char) {
    return /*html*/`
        <div class="contact-letter">
            <h5>${char}</h5>
        </div>
    `;
}


export function contactHTMLTemplate(contact) {
    return /*html*/`
        <div class="contact" tabindex="0">
            <div class="contact-initials" style="background: hsl(${contact.color}, 100%, 45%)">
                <span>${contact.initials}</span>
            </div>
            <div>
                <h5>${contact.lastname}, ${contact.firstname}</h5>
                <span>${contact.email}</span>
            </div>
        </div>
    `;
}