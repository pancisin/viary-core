import Vue from 'vue'
export default (baseUrl) => {
  const DIARY_API_URL = `${baseUrl}/api/v1/diary`;

  const getContacts = diaryId => {
    return Vue.http.get(`${DIARY_API_URL}/${diaryId}/contact`).then(response => {
      return Promise.resolve(response.body);
    })
  }

  const postContact = (diaryId, contact) => {
    return Vue.http.post(`${DIARY_API_URL}/${diaryId}/contact`, contact).then(response => {
      return Promise.resolve(response.body);
    })
  }

  return {
    getContacts,
    postContact
  }
}