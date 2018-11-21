<template>
  <div 
    class="diary-day-note" 
    :class="{ 'diary-day-note-upcoming' : upcoming }">
    
    <div v-if="editMode" class="d-flex jc-sb w-100p">
      <form 
        class="form flex-grow-1 mL-10 mR-10" 
        @submit.prevent="finishEditing" 
        v-click-outside="finishEditing">
        <input 
          ref="editInput"
          class="diary-day-content" 
          v-model="noteCp.content"
          v-suggestor="suggestor" >
      </form>
      <div class="diary-day-note-controls">
        <a class="text-danger" @click="deleteNote">
          <i class="lnr lnr-trash"></i>
        </a>
      </div>
    </div>

    <div v-else @click="editNote">
      <span class="diary-note-time">{{ noteParsed.time }}</span>
      <span class="diary-day-note-content">
        {{ noteParsed.content }}
      </span>
    </div>
  </div>
</template>

<script>
import { ClickOutside } from '@/directives'
import { Suggestor } from '../_directives';

import { mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'

export default {
  props: {
    note: {
      type: Object,
      required: true
    },
    ts: {
      type: Number,
      required: true
    },
    upcoming: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  directives: {
    ClickOutside,
    Suggestor
  },
  data () {
    return {
      editMode: false,
      noteCp: { ...this.note },
      deletingInProgress: false
    }
  },
  watch: {
    note (newVal) {
      this.noteCp = { ...newVal }
    }
  },
  computed: {
    ...mapGetters('$_contacts', [ 'contacts' ]),
    noteParsed () {
      const res = this.noteCp.content.match(/([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](PM|AM)?/)
      if (res != null) {
        return {
          time: res[0],
          content: res.index === 0 ? this.noteCp.content.replace(res[0], '') : this.noteCp.content
        }
      }

      return {
        content: this.noteCp.content
      }
    },
    suggestor () {
      return {
        symbol: '@',
        options: this.contacts
      }
    }
  },
  methods: {
    ...mapActions('$_diary', ['updateDayNote', 'deleteDayNote']),
    editNote () {
      this.editMode = true;
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    finishEditing () {
      if (!this.deletingInProgress) {
        const date = DateTime.fromMillis(this.ts)
        this.updateDayNote({
          note: this.noteCp, 
          weekNumber: date.weekNumber, 
          ordinal: date.ordinal, 
          year: date.year 
        })
        this.editMode = false;
      }
    },
    deleteNote () {
      this.deletingInProgress = true;
      const date = DateTime.fromMillis(this.ts)
      this.deleteDayNote({ 
        noteId: this.noteCp.id, 
        weekNumber: date.weekNumber, 
        year: date.year, 
        ordinal: date.ordinal 
      }).then(() => {
        this.editMode = false;
      })
    }
  }
}
</script>
