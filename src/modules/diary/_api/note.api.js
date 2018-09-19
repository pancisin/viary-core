import Vue from "vue";
export default baseUrl => {
  const NOTE_API_URL = `${baseUrl}/api/v1/note`;

  const updateNote = (noteId, note, success) => {
    Vue.http.put(`${NOTE_API_URL}/${noteId}`, note).then(response => {
      success(response.body)
    })
  }

  return {
    updateNote
  }
};
