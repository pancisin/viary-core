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

  const postDiary = diary => {
    return db.post(diary).then(response => {
      return Promise.resolve(diary)
    })
  }

  const putDiary = (diaryId, diary) => {
    return db.get(diaryId).then(response => {
      return db.put({
        ...diary,
        _id: response._id,
        _rev: response._rev
      }).then(_ => {
        return Promise.resolve(diary)
      })
    })
  }

  const getDiary = diaryId => db.get(diaryId)

  const deleteDiary = diaryId => {
    return db.get(diaryId).then(diary => {
      return db.remove(diary).then(_ => {
        return Promise.resolve(diaryId)
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