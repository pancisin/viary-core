import DiaryApi from '../_api/diary.api';
import * as types from './mutation_types';

export default options => {
  const baseUrl = options.baseUrl || '';

  const api = DiaryApi(baseUrl)

  const initializeContactsList = ({ commit }, diaryId) => {
    api.getContacts(diaryId).then(contacts => {
      commit(types.SET_CONTACTS, { contacts })
    })
  }

  const createContact = ({ commit, rootGetters }, contact) => {
    const diaryId = rootGetters['$_diary/scopedDiary'].slug;

    api.postContact(diaryId, contact).then(result => {
      commit(types.ADD_CONTACT, { contact: result })
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