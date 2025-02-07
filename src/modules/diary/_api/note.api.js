import Vue from "vue";
export default baseUrl => {
  const NOTE_API_URL = `${baseUrl}/api/v1/note`;

  const updateNote = (noteId, note) => {
    return Vue.http.put(`${NOTE_API_URL}/${noteId}`, note).then(response => {
      return Promise.resolve(response.body)
    })
  }

  const deleteNote = noteId => {
    return Vue.http.delete(`${NOTE_API_URL}/${noteId}`).then(response => {
      return Promise.resolve(response.body)
    })
  }

  return {
    updateNote,
    deleteNote
  }
};
