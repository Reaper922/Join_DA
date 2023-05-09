'use strict';


import { storeContacts, loadContacts } from './storage.js';
import { contactSeparatorHTMLTemplate, contactHTMLTemplate } from './templates.js';


let contacts = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    contacts = await loadContacts();
    renderContacts();
    setAllButtonEventListeners();
}


/**
 * 
 */
function setAllButtonEventListeners() {
    const addContactBtn = document.getElementById('add-contact');
    const editContactBtn = document.getElementById('edit-contact');
    const dialogContactCloseBtn = document.getElementById('dialog-contact-close');
    const dialogContactCreateBtn = document.getElementById('dialog-create-contact');
    const deleteContactBtn = document.getElementById('delete-contact');
    const dialogDeleteCloseBtn = document.getElementById('dialog-contact-delete-close');
    const dialogDeleteDeleteBtn = document.getElementById('dialog-contact-delete-delete');
    
    addContactBtn.onclick = () => showContactDialog('add');
    editContactBtn.onclick = () => showContactDialog('edit');
    dialogContactCloseBtn.onclick = closeContactDialog;
    dialogContactCreateBtn.onclick = createContactFunctions;
    deleteContactBtn.onclick = showDeleteDialog;
    dialogDeleteCloseBtn.onclick = closeDeleteDialog;
    dialogDeleteDeleteBtn.onclick = deleteContactFunctions;
    setContactEventListeners();
}


/**
 * 
 */
function setContactEventListeners() {
    document.querySelectorAll('.contact').forEach(contactEl => {
        contactEl?.addEventListener('click', () => {
            unmarkAllContacts();
            markActiveContact(contactEl.dataset.id);
            showContactDetails(contactEl.dataset.id);
        })
    })
}


/**
 * 
 * @param {Event} event Button pointer event.
 */
async function createContactFunctions(event) {
    resetValidityMessages();

    if (isFormValid()) {
        const contact = addContact();
        sortContacts();
        renderContacts();
        markActiveContact(contact.id);
        showContactDetails(contact.id);
        setContactEventListeners();
        await storeContacts(contacts);
    } else {
        event.preventDefault();
        reportFormValidity();
    }
}


/**
 * 
 * @param {Event} event Button pointer event.
 * @param {Object} contact Object of the contact.
 */
async function editContactFunctions(event, contact) {
    resetValidityMessages();

    if (isFormValid()) {
        updateContact(contact);
        sortContacts();
        renderContacts();
        markActiveContact(contact.id);
        showContactDetails(contact.id);
        setContactEventListeners();
        await storeContacts(contacts);
    } else {
        event.preventDefault();
        reportFormValidity();
    }
}


/**
 * 
 */
async function deleteContactFunctions() {
    const dialogDeleteDeleteBtn = document.getElementById('dialog-contact-delete-delete');
    const contactId = dialogDeleteDeleteBtn?.dataset.id;

    deleteContact(contactId);
    hideContactDetails();
    closeDeleteDialog();
    renderContacts();
    setContactEventListeners();
    await storeContacts(contacts);
}


/**
 * 
 * @returns {Boolean}
 */
function isFirstnameValid() {
    const dialogFirstnameEl = document.getElementById('dialog-firstname');

    return dialogFirstnameEl.value.length > 0;
}


/**
 * 
 * @returns {Boolean}
 */
function isLastnameValid() {
    const dialogLastnameEl = document.getElementById('dialog-lastname');

    return dialogLastnameEl.value.length > 0;
}


/**
 * 
 * @returns {Array | Null}  
 */
function isEmailValid() {
    const dialogEmailEl = document.getElementById('dialog-email');

    return dialogEmailEl.value.match('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
}


/**
 * 
 * @returns 
 */
function isFormValid() {
    return isFirstnameValid() &&
        isLastnameValid() &&
        isEmailValid();
}


/**
 * 
 */
function reportFormValidity() {
    const dialogFirstnameValidityEl = document.getElementById('dialog-firstname-validity');
    const dialogLastnameValidityEl = document.getElementById('dialog-lastname-validity');
    const dialogEmailValidityEl = document.getElementById('dialog-email-validity');

    if (!isFirstnameValid()) {
        dialogFirstnameValidityEl.innerHTML = 'Please provide a firstname.';
    }
    if (!isLastnameValid()) {
        dialogLastnameValidityEl.innerHTML = 'Please provide a lastname.';
    }
    if (!isEmailValid()) {
        dialogEmailValidityEl.innerHTML = 'Please provide a valid email.';
    }
}


/**
 * 
 */
function resetValidityMessages() {
    const dialogFirstnameValidityEl = document.getElementById('dialog-firstname-validity');
    const dialogLastnameValidityEl = document.getElementById('dialog-lastname-validity');
    const dialogEmailValidityEl = document.getElementById('dialog-email-validity');

    dialogFirstnameValidityEl.innerHTML = '';
    dialogLastnameValidityEl.innerHTML = '';
    dialogEmailValidityEl.innerHTML = '';
}


/**
 * 
 * @returns {Object} Object of the contact.
 */
function addContact() {
    const dialogFirstnameEl = document.getElementById('dialog-firstname');
    const dialogLastnameEl = document.getElementById('dialog-lastname');
    const dialogEmailEl = document.getElementById('dialog-email');
    const dialogPhoneEl = document.getElementById('dialog-phone');
    const id = Date.now().toString(36);
    const initials = (dialogFirstnameEl.value.charAt(0) + dialogLastnameEl.value.charAt(0)).toUpperCase();
    const color = Math.floor(Math.random() * 355);

    const contact = {
        id: id,
        firstname: dialogFirstnameEl?.value.trim(),
        lastname: dialogLastnameEl?.value.trim(),
        initials: initials,
        email: dialogEmailEl?.value.trim(),
        phone: dialogPhoneEl?.value.trim(),
        color: color
    }

    contacts.push(contact);
    return contact;
}


/**
 * 
 * @param {Object} contact Object of the contact.
 * @returns {Object} Object of the contact.
 */
function updateContact(contact) {
    const dialogFirstnameEl = document.getElementById('dialog-firstname');
    const dialogLastnameEl = document.getElementById('dialog-lastname');
    const dialogEmailEl = document.getElementById('dialog-email');
    const dialogPhoneEl = document.getElementById('dialog-phone');

    contact.firstname = dialogFirstnameEl?.value;
    contact.lastname = dialogLastnameEl?.value;
    contact.email = dialogEmailEl?.value;
    contact.phone = dialogPhoneEl?.value;

    return contact;
}


/**
 * 
 * @param {String} contactId Contact ID.
 * @returns {Array} Array of removed contacts.
 */
function deleteContact(contactId) {
    const contact = findContact(contactId);
    const contactIndex = contacts.indexOf(contact);

    return contacts.splice(contactIndex, 1);
}


/**
 * 
 * @param {String} contactId Contact ID.
 * @returns {Object} Object of the contact.
 */
function findContact(contactId) {
    return contacts.find(contact => contact.id === contactId);
}


/**
 * 
 */
function sortContacts() {
    contacts = contacts.sort((contactA, contactB) => {
        return contactA.lastname.toLowerCase().localeCompare(contactB.lastname.toLowerCase()) ||
            contactA.firstname.toLowerCase().localeCompare(contactB.firstname.toLowerCase());
    });
}


/**
 * 
 */
function unmarkAllContacts() {
    document.querySelectorAll('.contact').forEach(contactEl => {
        contactEl?.classList.remove('active-contact');
    });
}


/**
 * 
 * @param {String} contactId Contact ID.
 */
function markActiveContact(contactId) {
    const contactEl = document.querySelector(`[data-id="${contactId}"]`);

    contactEl?.classList.add('active-contact');
    contactEl?.scrollIntoView({block: 'center', behavior: 'smooth'});
}


/**
 * 
 */
function renderContacts() {
    const contactListEl = document.getElementById('contact-list');
    let htmlContactList = '';
    let char = '';

    if (contacts.length > 0) {
        for (let contact of contacts) {
            const lastnameChar = contact.lastname.charAt(0).toUpperCase();

            if (lastnameChar != char) {
                char = lastnameChar;
                htmlContactList += contactSeparatorHTMLTemplate(lastnameChar);
            }

            htmlContactList += contactHTMLTemplate(contact);
        }
    } else {
        htmlContactList += contactSeparatorHTMLTemplate('No contacts stored.');
    }

    contactListEl.innerHTML = htmlContactList;
}


/**
 * 
 * @param {String} contactId Contact ID.
 */
function showContactDetails(contactId) {
    const contact = findContact(contactId);
    const detailsInitialsEl = document.getElementById('details-initials');
    const detailsNameEl = document.getElementById('details-name');
    const detailsEmailEl = document.getElementById('details-email');
    const detailsPhoneEl = document.getElementById('details-phone');
    const contactEditEl = document.getElementById('edit-contact');
    const contactDeleteEl = document.getElementById('dialog-contact-delete-delete');
    const contactDetailsEl = document.getElementById('contact-details');

    detailsInitialsEl.style.background = `hsl(${contact?.color}, 100%, 50%)`;
    detailsInitialsEl.children[0].innerHTML = contact?.initials;
    detailsNameEl.innerHTML = `${contact?.firstname} ${contact?.lastname}`;
    detailsEmailEl.innerHTML = contact?.email;
    detailsEmailEl.href = `mailto:${contact?.email}`;
    detailsPhoneEl.innerHTML = contact?.phone;
    detailsPhoneEl.href = `tel:${contact?.phone}`;
    contactEditEl.dataset.id = contact?.id;
    contactDeleteEl.dataset.id = contact?.id;
    contactDetailsEl?.classList.remove('d-none');
}


/**
 * 
 */
function hideContactDetails() {
    const contactDetailsEl = document.getElementById('contact-details');

    contactDetailsEl?.classList.add('d-none');
}


/**
 * 
 * @param {String} mode Dialog mode (add or edit contact).
 */
function showContactDialog(mode) {
    const dialogContact = document.getElementById('dialog-contact');

    switch(mode) {
        case 'add':
            setUpDialogAdd();
            break;
        case 'edit':
            setUpDialogEdit();
            break;
    }

    dialogContact?.showModal();
}


/**
 * 
 */
function setUpDialogAdd() {
    const dialogContactHeader = document.getElementById('dialog-contact-header');
    const dialogContactCreateBtn = document.getElementById('dialog-create-contact');

    dialogContactHeader.innerHTML = 'Add Contact';
    dialogContactCreateBtn.children[0].innerHTML = 'Create Contact';
    dialogContactCreateBtn.onclick = event => createContactFunctions(event);
    clearContactDialogInputs();
    resetValidityMessages();
}


/**
 * 
 */
function setUpDialogEdit() {
    const dialogContactHeader = document.getElementById('dialog-contact-header');
    const dialogContactCreateBtn = document.getElementById('dialog-create-contact');
    const editContactBtn = document.getElementById('edit-contact');
    const contact = findContact(editContactBtn.dataset.id);

    dialogContactHeader.innerHTML = 'Edit Contact';
    dialogContactCreateBtn.children[0].innerHTML = 'Update Contact';
    dialogContactCreateBtn.onclick = event => editContactFunctions(event, contact);
    clearContactDialogInputs();
    prefillContactDialogInputs(contact);
    resetValidityMessages();
}


/**
 * 
 */
function closeContactDialog() {
    const dialogContact = document.getElementById('dialog-contact');

    dialogContact?.close();
}


/**
 * 
 * @param {Object} contact Object of the contact.
 */
function prefillContactDialogInputs(contact) {
    const dialogFirstnameEl = document.getElementById('dialog-firstname');
    const dialogLastnameEl = document.getElementById('dialog-lastname');
    const dialogEmailEl = document.getElementById('dialog-email');
    const dialogPhoneEl = document.getElementById('dialog-phone');

    dialogFirstnameEl.value = contact.firstname;
    dialogLastnameEl.value = contact.lastname;
    dialogEmailEl.value = contact.email;
    dialogPhoneEl.value = contact.phone;
}


/**
 * 
 */
function clearContactDialogInputs() {
    const dialogFirstnameEl = document.getElementById('dialog-firstname');
    const dialogLastnameEl = document.getElementById('dialog-lastname');
    const dialogEmailEl = document.getElementById('dialog-email');
    const dialogPhoneEl = document.getElementById('dialog-phone');

    dialogFirstnameEl.value = '';
    dialogLastnameEl.value = '';
    dialogEmailEl.value = '';
    dialogPhoneEl.value = '';
}


/**
 * 
 */
function showDeleteDialog() {
    const dialogDelete = document.getElementById('dialog-contact-delete');

    dialogDelete?.showModal();
}


/**
 * 
 */
function closeDeleteDialog() {
    const dialogDelete = document.getElementById('dialog-contact-delete');

    dialogDelete?.close();
}


onload = init();