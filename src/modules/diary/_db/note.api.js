import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';
import { DateTime } from 'luxon';

import ChangeApi from './change.api';

export default _ => {
  PouchDB.plugin(PouchDBFindPlugin)
  var db = new PouchDB('note_db');

  const change = ChangeApi();

  const getDays = (diaryId, filter) => {
    return db.find({
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

      return Promise.resolve(result)
    })
  }

  const postNote = (diaryId, { ordinal, year, content }) => {
    const note = {
      diary_id: diaryId,
      date_number: ordinal,
      year,
      content
    }

    return db.post(note).then(response => {
      const newNote = {
        ...note,
        id: response.id,
      }

      change.createNote(newNote)
      return Promise.resolve(newNote)
    }) 
  }
  
  const syncUpdateNote = (noteId, note) => {
    return db.get(noteId).then(pn => {
      return {
        ...note,
        _id: pn._id,
        _rev: pn._rev
      }
    }).catch(err => {
      if (err.status === 404) {
        return {
          ...note,
          _id: note.id
        }
      }
    }).then(pn => {
      return db.put(pn).then(_ => {
        return Promise.resolve(note)
      })
    })
  }

  const updateNote = (noteId, note) => {
    return db.get(noteId).then(pn => {
      return {
        ...note,
        _id: pn._id,
        _rev: pn._rev
      }
    }).catch(err => {
      if (err.status === 404) {
        return {
          ...note,
          _id: note.id
        }
      }
    }).then(pn => {
      return db.put(pn).then(_ => {
        change.updateNote(noteId, note);
        return Promise.resolve(note)
      })
    })
  }

  const deleteNote = noteId => {
    return db.get(noteId).then(note => {
      return db.remove(note).then(_ => {
        change.deleteNote(noteId, note);
      }).then(_ => {
        return Promise.resolve(noteId)
      })
    }) 
  }

  const getNote = (noteId) => db.get(noteId)

  const destroyDatabase = _ => {
    return db.destroy();
  }

  return {
    getDays,
    postNote,
    updateNote,
    syncUpdateNote,
    deleteNote,
    destroyDatabase
  }
};