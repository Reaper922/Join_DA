'use strict';


let contacts = []

async function init() {
    await downloadFromServer();
    contacts = await loadItem('contacts');
    buttonEventListener();
    renderContactList();
}


function buttonEventListener() {
    const newContactBtn = document.getElementById('new-contact');
    const modal = document.getElementById('modal');
    const modalSubmitBtn = document.getElementById('modal-submit');
    const closeModalBtn = document.getElementById('close-modal');

    newContactBtn?.addEventListener('click', () => {
        modal?.showModal();
    })

    closeModalBtn?.addEventListener('click', () => {
        modal?.close();
    })

    modalSubmitBtn?.addEventListener('click', () => {
        addContact();
    })
}


function addContact() {
    const firstnameInp = document.getElementById('new-firstname');
    const lastnameInp = document.getElementById('new-lastname');
    const emailInp = document.getElementById('new-email');
    const phoneInp = document.getElementById('new-phone');

    if (firstnameInp.checkValidity() && lastnameInp.checkValidity() && emailInp.checkValidity() && phoneInp.checkValidity()) {
        const { id } = createContact(firstnameInp, lastnameInp, emailInp, phoneInp);
        sortContacts();
        storeItem('contacts', contacts);
        clearInputFields(firstnameInp, lastnameInp, emailInp, phoneInp);
        renderContactList();
        showContactDetails(id);
        notify();
    }
}


function createContact(firstnameInp, lastnameInp, emailInp, phoneInp) {
    const id = Date.now().toString(36);
    const color = Math.floor(Math.random() * 355);

    const contact = {
        id: id,
        firstname: firstnameInp?.value.trim(),
        lastname: lastnameInp?.value.trim(),
        email: emailInp?.value.trim(),
        phone: phoneInp?.value.trim(),
        color: color
    }

    contacts.push(contact);
    return contact;
}


function clearInputFields(firstnameInp, lastnameInp, emailInp, phoneInp) {
    firstnameInp.value = '';
    lastnameInp.value = '';
    emailInp.value = '';
    phoneInp.value = '';
}


function renderContactList() {
    const contactListEl = document.getElementById('contact-list')
    let contactList = '';

    for (let contact of contacts) {
        contactList += contactTemp(contact);
    }

    contactListEl.innerHTML = contactList;
}


/**
 * Sorts the contact list by lastname.
 */
function sortContacts() {
    contacts = contacts.sort((contactA, contactB) => {
        return contactA.lastname.toLowerCase().localeCompare(contactB.lastname.toLowerCase()) ||
            contactA.firstname.toLowerCase().localeCompare(contactB.firstname.toLowerCase())
    });
}


function showContactDetails(id) {
    const contact = contacts.find(contact => contact.id === id);
    const contactDetailsEl = document.getElementById('contact-details-body');
    const bubbleEl = document.getElementById('contact-details-bubble');
    const initialsEl = document.getElementById('contact-details-initials');
    const nameEl = document.getElementById('contact-details-name');
    const emailEl = document.getElementById('contact-details-email');
    const phoneEl = document.getElementById('contact-details-phone');
    const editBtn = document.getElementById('edit-contact');
    const deleteBtn = document.getElementById('delete-contact');

    contactDetailsEl?.classList.remove('d-none');
    bubbleEl.style = `background: hsl(${contact.color}, 100%, 30%)`;
    initialsEl.innerHTML = `${contact.firstname.charAt(0).toUpperCase()}${contact.lastname.charAt(0).toUpperCase()}`
    nameEl.innerHTML = contact.firstname + ' ' + contact.lastname;
    emailEl.innerHTML = contact.email;
    emailEl.href = `mailto:${contact.email}`;
    phoneEl.innerHTML = contact.phone;
    phoneEl.href = `tel:${contact.phone}`;
    editBtn.onclick = () => 
    deleteBtn.onclick = () => deleteContact(id);
}


/**
 * Deletes the contact from the contact list. 
 * @param {String} id Unique id of the contact
 */
function deleteContact(id) {
    const contactDetailsEl = document.getElementById('contact-details-body');
    const contact = contacts.find(contact => contact.id === id);
    const index = contacts.indexOf(contact);
    contacts.splice(index, 1);

    contactDetailsEl.classList.add('d-none');

    renderContactList();
    storeItem('contacts', contacts);
    notify('Succesfully deleted!');
}


function contactTemp({ firstname, lastname, email, color, id }) {
    return (`
        <div class="contact" onclick="showContactDetails('${id}')">
            <div class="contact-bubble" style="background: hsl(${color}, 100%, 30%);">
                <p class="contact-initials txt-h7">${firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase()}</p>
            </div>
            <div>
                <h5 class="contact-full-name txt-h5">${firstname + " " + lastname}</h5>
                <p class="contact-email">${email}</p>
            </div>
        </div>
    `);
}


function contactSeparatorTemp() {
    return (`
        <div class="contact-separator">
            <h5 class="character">A</h5>
            <div class="separator-line"></div>
        </div>
    `);
}


init();