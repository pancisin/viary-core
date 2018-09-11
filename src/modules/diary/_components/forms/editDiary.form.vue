<template>
  <form class="form" @submit.prevent="submit">
    <div class="form-group">
      <label class="text-normal text-dark">Name</label>
      <input
        v-model.trim="diaryCp.name"
        type="text"
        class="form-control"
        placeholder="My daily diary">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">Description</label>
      <textarea class="form-control" v-model.trim="diaryCp.description" />
    </div>
    <div class="text-right">
      <button type="submit" class="btn btn-outline-primary">
        Update
      </button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    diary: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      diaryCp: { ...this.diary }
    }
  },
  methods: {
    // ...mapActions(['createDiary']),
    submit () {
      // this.createDiary(this.diary).then(() => {
      //   this.$router.push({ name: 'diary' })
      // })
    }
  }
}
</script>
