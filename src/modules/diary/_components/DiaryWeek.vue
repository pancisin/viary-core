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
    let x0 = null, y0 = null, locked = false;

    const unify = e => {	return e.changedTouches ? e.changedTouches[0] : e };

    const lock = e => {
      x0 = unify(e).clientX;
      y0 = unify(e).clientY;
      locked = true
    };

    const drag = e => {
      let dx = unify(e).clientX - x0, dy = unify(e).clientY - y0;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (locked && Math.abs(dx) > 50) {
          e.preventDefault();
          el.style.transform = `translateX(${Math.round(unify(e).clientX - x0)}px)`
        }
      }
    };

    const move = (e) => {
      if(locked) {
        let dx = unify(e).clientX - x0

        if (Math.abs(dx) > 100) {
          velocity(el, { 
            translateX: [ dx * 3, dx ],
            opacity: 1
          }, { 
            duration: 500, //300, 
            easing: [ 300, 20]
          })
          .then(_ => {
            if (dx > 100) {
              return -1;  
            } else if (dx < -100) {
              return 1;
            }
          })
          .then(dir => {
            return this.manipulateScope(dir)
          })
          .then(dir => {
            console.log(dir)
            return velocity(el, {
              translateX: [ 0, -dx ],
              opacity: 1
            }, {
              duration: 900, //300, 
              easing: [ 300, 20]
            })
          });
        } else {
          el.style.transform = 'translateX(0px)';
        }

        x0 = null;
        y0 = null;
        locked = false
      }
    };

    // Uncoment following lines to enable swipe gestures on diary week that manipulates scoped day.
    // el.addEventListener('touchstart', lock, false);
    // el.addEventListener('touchmove', drag, false);
    // el.addEventListener('touchend', move, false);
  },
  methods: {
    ...mapActions('$_diary',['scopeDay']),
    manipulateScope(diff) {
      return this.scopeDay({ day: this.scopedDay.plus({ weeks: diff }) })
    },
  } 
};
</script>
