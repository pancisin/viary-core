import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';
import { DateTime } from 'luxon';

import ChangeApi from './change.api';

export default _ => {
  PouchDB.plugin(PouchDBFindPlugin)
  var db = new PouchDB('note_db');

  const change = ChangeApi();

  const getDays = (diaryId, filter, success) => {
    db.find({
      selector: {
        diary_id: diaryId,
        date_number: {
          $gte: DateTime.fromFormat(filter.from, 'MM/dd/yyyy').ordinal,
          $lte: DateTime.fromFormat(filter.to, 'MM/dd/yyyy').ordinal
        },
        year: DateTime.fromFormat(filter.from, 'MM/dd/yyyy').year
      }
    }).then(response => {
      const d = response.docs.reduce((acc, cur) => {
        if (acc[cur.date_number] == null) {
          acc[cur.date_number] = {
            date_number: cur.date_number,
            year: cur.year,
            notes: [ { ...cur, id: cur._id } ]
          }
        } else {
          acc[cur.date_number] = {
            ...acc[cur.date_number],
            notes: [
              ...acc[cur.date_number].notes,
              { ...cur, id: cur._id }
            ]
          }
        }

        return acc;
      }, {})

      const result = [];
      for (let prop in d) {
        result.push(d[prop])
      }

      success(result)
    })
  }

  const postNote = (diaryId, { ordinal, year, content }, success) => {
    const note = {
      diary_id: diaryId,
      date_number: ordinal,
      year,
      content
    }

    db.post(note).then(response => {
      const newNote = {
        ...note,
        id: response.id,
      }

      change.createNote(newNote)
      success(newNote)
    }) 
  }
  
  const syncUpdateNote = (noteId, note, success) => {
    const callback = success || function () {}

    db.get(noteId).then(pn => {
      db.put({
        ...note,
        _id: pn._id,
        _rev: pn._rev
      }).then(_ => {
        callback(note);
      })
    }).catch(err => {
      if (err.status === 404) {
        db.put({
          ...note,
          _id: note.id
        }).then(_ => {
          callback(note)
        })
      }
    })
  }

  const updateNote = (noteId, note, success) => {
    const callback = success || function() {}

    db.get(noteId).then(pn => {
      db.put({
        ...note,
        _id: pn._id,
        _rev: pn._rev
      }).then(_ => {
        change.updateNote(noteId, note);
        callback(note);
      })
    }).catch(err => {
      if (err.status === 404) {
        db.put({
          ...note,
          _id: note.id
        }).then(_ => {
          callback(note)
        })
      }
    })
  }

  const deleteNote = (noteId, success, error) => {
    db.get(noteId).then(note => {
      db.remove(note).then(_ => {
        change.deleteNote(noteId, note);
        success(noteId)
      })
    }) 
  }

  const getNote = (noteId, success) => {
    db.get(noteId).then(note => {
      success(note);
    })
  }

  return {
    getDays,
    postNote,
    updateNote,
    syncUpdateNote,
    deleteNote
  }
};