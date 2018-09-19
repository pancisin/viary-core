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
    <span 
      v-else @click="editNote" 
      class="diary-day-note-entry">
    - {{ note.content }}
    </span>
  </div>
</template>

<script>
import { ClickOutside } from '@/directives'
import { mapActions } from 'vuex'
export default {
  props: {
    note: {
      type: Object,
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
    ...mapActions('$_diary', [ 'updateDayNote' ]),
    editNote () {
      this.editMode = true;
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    finishEditing () {
      this.updateDayNote(this.noteCp)
      this.editMode = false;
    }
  }
}
</script>

<style lang="scss">
.diary-day-note-entry {
  display: block;
}
</style>
