import PouchDB from 'pouchdb';

const operation = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

export default () => {
  var db = new PouchDB('changes_db');
  
  const getChanges = success => {
    db.allDocs({
      include_docs: true,
      attachments: true
    }).then(response => {
      const changes = response.rows.map(row => row.doc);
      success(changes);
    })
  }

  const createNote = (note, success) => {
    const change = {
      _id: note.id,
      operation: operation.CREATE,
      payload: note
    }

    db.put(change).then(_ => {
      if (success) {
        success(change);
      }
    })
  }

  const updateNote = (noteId, note, success) => {
    const change = {
      _id: noteId,
      operation: operation.UPDATE,
      payload: note
    }

    db.get(noteId).then(response => {
      return {
        ...change,
        _rev: response._rev
      }
    }).catch(response => {
      return change;
    }).then(ch => {
      db.put(ch).then(_ => {
        if (success) {
          success(ch);
        }
      })
    })
  }

  const deleteNote = (noteId, note, success) => {
    const change = {
      _id: noteId,
      operation: operation.DELETE,
      payload: note
    }

    db.get(noteId).then(response => {
      return {
        ...change,
        _rev: response._rev
      }
    }).catch(_ => {
      return change;
    }).then(ch => {
      db.put(ch).then(_ => {
        if (success) {
          success(ch);
        }
      })
    })
  }

  const deleteChange = (changeId, success) => {
    db.get(changeId).then(change => {
      console.warn(change)
      return db.remove(change._id, change._rev)
    }).then(_ => {
      if (success) {
        success(changeId)
      }
    })
  }

  return {
    getChanges,
    createNote,
    updateNote,
    deleteNote,
    deleteChange
  }
}