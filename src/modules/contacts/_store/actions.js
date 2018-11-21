import DiaryApi from '../_api/diary.api';
import * as types from './mutation_types';

export default options => {
  const baseUrl = options.baseUrl || '';

  const api = DiaryApi(baseUrl)

  const initializeContactsList = ({ commit }, diaryId) => {
    commit(types.SET_LOADING_CONTACTS_IN_PROGRESS, true);
    api.getContacts(diaryId).then(contacts => {
      commit(types.SET_CONTACTS, { contacts })
      commit(types.SET_LOADING_CONTACTS_IN_PROGRESS, false);
    })
  }

  const createContact = ({ commit, rootGetters }, contact) => {
    const diaryId = rootGetters['$_diary/scopedDiary'].slug;

    commit(types.SET_LOADING_CONTACTS_IN_PROGRESS, true);    
    api.postContact(diaryId, contact).then(result => {
      commit(types.ADD_CONTACT, { contact: result })
      commit(types.SET_LOADING_CONTACTS_IN_PROGRESS, false);      
    })
  }

  const scopeContact = ({ commit, getters }, contact) => {
    const idx = getters.contacts.findIndex(c => c.id === contact.id)

    if (idx !== -1) {
      commit(types.SCOPE_CONTACT, { contact: getters.contacts[idx] })
    }
  }

  const updateContact = ({ commit }, contact) => {

  }

  const deleteContact = ({ commit }, contact) => {

  }

  return {
    initializeContactsList,
    createContact,
    scopeContact,
    updateContact,
    deleteContact
  }
}