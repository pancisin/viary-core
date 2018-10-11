<template>
  <div class="diary-week" ref="diaryWeek">
    <diary-day 
      v-for="day in days" 
      :key="day.ts" 
      :day="day" />
  </div>
</template>

<script>
import DiaryDay from './DiaryDay';
import { mapGetters, mapActions } from 'vuex';
import velocity from 'velocity-animate';

export default {
  components: {
    DiaryDay
  },
  props: {
    days: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters('$_diary', ['scopedDay'])
  },
  mounted () {
    const el = this.$el;
    let x0 = null, locked = false;

    const unify = e => {	return e.changedTouches ? e.changedTouches[0] : e };

    const lock = e => {
      x0 = unify(e).clientX;
      locked = true
    };

    const drag = e => {
      e.preventDefault();
      
      if(locked) {
        el.style.transform = `translateX(${Math.round(unify(e).clientX - x0)}px)`
      }
    };

    const move = (e) => {
      if(locked) {
        let dx = unify(e).clientX - x0
        velocity(el, { 
          translateX: [ 0, dx ]
        }, { 
          duration: 300, 
          easing: [ 500, 20]
        }).then(_ => {
          x0 = null
          if (dx > 50) {
            this.manipulateScope(-1)     
          } else if (dx < -50) {
            this.manipulateScope(1)
          }
        });
      }
    };

    el.addEventListener('touchstart', lock, false);
    el.addEventListener('touchmove', drag, false);
    el.addEventListener('touchend', move, false);
  },
  methods: {
    ...mapActions('$_diary',['scopeDay']),
    manipulateScope(diff) {
      this.scopeDay({ day: this.scopedDay.plus({ weeks: diff }) })
    },
  } 
};
</script>

<style>
</style>
