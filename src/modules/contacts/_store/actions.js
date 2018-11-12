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

  const updateContact = ({ commit }, contact) => {

  }

  const deleteContact = ({ commit }, contact) => {

  }

  return {
    initializeContactsList,
    createContact,
    updateContact,
    deleteContact
  }
}