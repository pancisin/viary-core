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
    return db.get(diaryId).then(nd => {
      return {
        ...diary,
        _id: nd._id,
        _rev: nd._rev
      }
    }).catch(_ => {
      return {
        ...diary,
        _id: diary.id
      }
    }).then(nd => {
      return db.put(nd).then(_ => {
        return Promise.resolve(nd)
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