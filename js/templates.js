'use strict';


//-------------- Contact Templates --------------// 

/**
 * 
 * @param {String} char Character that should be rendered in the separator.
 * @returns {String} HTML string of the contact separator
 */
export function contactSeparatorHTMLTemplate(char) {
    return /*html*/`
        <div class="contact-letter">
            <h5>${char}</h5>
        </div>
    `;
}


/**
 * 
 * @param {Object} contact Object of the contact.
 * @returns {String} HTML string of the contact for the contact list.
 */
export function contactHTMLTemplate(contact) {
    return /*html*/`
        <div class="contact" data-id="${contact.id}" tabindex="0">
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