import * as types from './mutation_types';

export default {
  
  [types.SET_CONTACTS] (state, { contacts }) {
    state.contacts = contacts;
  },

  [types.ADD_CONTACT] (state, { contact }) {
    state.contacts = [
      ...state.contacts,
      contact
    ]
  },

  [types.SCOPE_CONTACT] (state, { contact }) {
    state.scopedContact = contact;
  }
}