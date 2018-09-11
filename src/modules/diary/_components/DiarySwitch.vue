<template>
  <div>
    <div class="form-group">
      <select class="form-control" v-model="selectedDiary" @change="diarySelectChagne">
        <option v-for="(diary, index) in diaries" :key="index" :value="diary.slug">
          {{ diary.name }}
        </option>
        <option :value="createOptionValue">
          + create new diary
        </option>
      </select>
    </div>

    <div class="text-center">
      <button 
        type="button" 
        class="btn btn-outline-success" 
        @click="switchDiary">
        Switch
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { guid } from '@/utils';

export default {
  data () {
    return {
      selectedDiary: null,
      createOptionValue: null
    }
  },
  computed: {
    ...mapGetters('$_diary', ['diaries', 'scopedDiary', 'scopedDay'])
  },
  created() {
    this.createOptionValue = guid();
  },
  mounted () {
    this.selectedDiary = this.scopedDiary.slug
  },
  methods: {
    ...mapActions('$_diary', ['scopeDiary']),
    switchDiary() {
      this.scopeDiary({ slug: this.selectedDiary, scopeDate: this.scopedDay.toSQL() }).then(diary => {
        this.$emit('switched', diary);
      })
    },
    diarySelectChagne (e) {
      if (e.target.value === this.createOptionValue) {
        this.$router.push({ name: 'diary.create' })
      }
    }
  }
}
</script>
