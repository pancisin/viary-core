<template>
  <div class="diary-day-note">
    <form 
      v-if="editMode" 
      class="form" 
      @submit.prevent="finishEditing" 
      v-click-outside="finishEditing">
      <input 
        ref="editInput"
        class="diary-day-content" 
        v-model="noteCp.content" >
    </form>
    <div 
      v-else @click="editNote">
      <span class="diary-day-note-delimiter">-</span>
      {{ note.content }}

      <div class="diary-day-note-controls mL-a">
        <a class="" @click="deleteNote">
          <i class="lnr lnr-trash"></i>
        </a>
      </div>
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
      noteCp: { ...this.note }
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
      const date = DateTime.fromMillis(this.ts)
      this.updateDayNote({ note: this.noteCp, weekNumber: date.weekNumber, ordinal: date.ordinal })
      this.editMode = false;
    },
    deleteNote () {
      const date = DateTime.fromMillis(this.ts)
      this.deleteDayNote({ noteId: this.noteCp.id, weekNumber: date.weekNumber, ordinal: date.ordinal }).then(() => {
        this.editMode = false;
      })
    }
  }
}
</script>

<style lang="scss">
.diary-day-note {
  border: 1px solid transparent;

  & > div {
    display: flex;
    width: 100%;
  }

  .diary-day-note-controls {
    display: none;
  }

  .diary-day-note-delimiter {
    display: inline;
  }

  &:hover { 
    border: 1px solid #ddd;

    .diary-day-note-delimiter {
      opacity: 0;
    }

    .diary-day-note-controls {
      display: block;
    }
  }
}
</style>
