import Vue from "vue";
export default baseUrl => {
  const NOTE_API_URL = `${baseUrl}/api/v1/note`;

  const updateNote = (noteId, note, success) => {
    const callback = success || function () {}

    Vue.http.put(`${NOTE_API_URL}/${noteId}`, note).then(response => {
      callback(response.body)
    })
  }

  const deleteNote = (noteId, success, error) => {
    Vue.http.delete(`${NOTE_API_URL}/${noteId}`).then(response => {
      success(response.body)
    }).catch(err => {
      if(error) {
        error(err)
      }
    })
  }

  return {
    updateNote,
    deleteNote
  }
};
