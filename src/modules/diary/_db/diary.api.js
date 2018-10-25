import PouchDB from 'pouchdb';

export default () => {
  var db = new PouchDB('diary_db');

  const getDiaries = _ => {
    return db.allDocs({
      include_docs: true,
      attachments: true
    }).then(response => {
      const diaries = response.rows.map(row => row.doc);
      return Promise.resolve(diaries)
    })
  }

  const postDiary = (diary, success) => {
    db.post(diary).then(response => {
      if (success) {
        success(diary)
      }
    })
  }

  const putDiary = (diaryId, diary, success) => {
    db.put(diary).then(response => {
      if (success) {
        success(diary)
      }
    })
  }

  const getDiary = (diaryId, success) => {
    db.get(diaryId).then(response => {
      success(response);
    })
  }

  const deleteDiary = (diaryId, success) => {
    db.get(diaryId).then(diary => {
      db.remove(diary).then(_ => {
        if (success) {
          success(diaryId)
        }
      })
    })
  }

  return {
    getDiaries,
    postDiary,
    putDiary,
    getDiary,
    deleteDiary
  }
}