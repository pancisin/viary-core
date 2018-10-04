<template>
  <div class="diary-day-note">
    <div v-if="editMode" class="d-flex jc-sb w-100p">
      <form 
        class="form flex-grow-1 mL-10 mR-10" 
        @submit.prevent="finishEditing" 
        v-click-outside="finishEditing">
        <input 
          ref="editInput"
          class="diary-day-content" 
          v-model="noteCp.content" >
      </form>
      <div class="diary-day-note-controls">
        <a class="text-danger" @click="deleteNote">
          <i class="lnr lnr-trash"></i>
        </a>
      </div>
    </div>

    <div v-else @click="editNote" class="diary-day-note-content">
      <!-- <span class="diary-day-note-delimiter">-</span> -->
      {{ note.content }}
    </div>
  </div>
</template>

<script>
import { ClickOutside } from '@/directives'
import { mapActions } from 'vuex'
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
    }
  },
  directives: {
    ClickOutside
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
        this.updateDayNote({ note: this.noteCp, weekNumber: date.weekNumber, ordinal: date.ordinal })
        this.editMode = false;
      }
    },
    deleteNote () {
      this.deletingInProgress = true;
      const date = DateTime.fromMillis(this.ts)
      this.deleteDayNote({ noteId: this.noteCp.id, weekNumber: date.weekNumber, ordinal: date.ordinal }).then(() => {
        this.editMode = false;
      })
    }
  }
}
</script>
