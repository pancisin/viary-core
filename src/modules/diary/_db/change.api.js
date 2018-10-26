import PouchDB from 'pouchdb';

const operation = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

export default () => {
  var db = new PouchDB('changes_db');
  
  const getChanges = _ => {
    return db.allDocs({
      include_docs: true,
      attachments: true
    }).then(response => {
      const changes = response.rows.map(row => row.doc);
      return Promise.resolve(changes)
    })
  }

  const createNote = note => {
    const change = {
      _id: note.id,
      operation: operation.CREATE,
      payload: note
    }

    return db.put(change).then(_ => {
      return Promise.resolve(change)
    })
  }

  const updateNote = (noteId, note) => {
    const change = {
      _id: noteId,
      operation: operation.UPDATE,
      payload: note
    }

    return db.get(noteId).then(response => {
      return {
        ...change,
        _rev: response._rev
      }
    }).catch(response => {
      return change;
    }).then(ch => {
      return db.put(ch).then(_ => {
        return Promise.resolve(ch)
      })
    })
  }

  const deleteNote = (noteId, note) => {
    const change = {
      _id: noteId,
      operation: operation.DELETE,
      payload: note
    }

    return db.get(noteId).then(response => {
      return {
        ...change,
        _rev: response._rev
      }
    }).catch(_ => {
      return change;
    }).then(ch => {
      return db.put(ch).then(_ => {
        return Promise.resolve(ch)
      })
    })
  }

  const deleteChange = changeId => {
    return db.get(changeId).then(change => {
      return db.remove(change._id, change._rev)
    }).then(_ => {
      return Promise.resolve(changeId)
    })
  }

  const destroyDatabase = _ => {
    return db.destroy();
  }

  return {
    getChanges,
    createNote,
    updateNote,
    deleteNote,
    deleteChange,
    destroyDatabase
  }
}