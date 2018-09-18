<script>
import velocity from 'velocity-animate';
export default {
  render(h) {
    return h('div', { class: 'cloud-canvas' }, [ ...Array(6).keys() ].map(() => h('div', {}, [ h('div', { class: 'cloud' }) ])))
  },
  mounted () {
    const random = (min, max) => (Math.random() * (max - min)) + min;

    const applyAnimation = (el, startFromNowhere) => {
      const maxMargin = startFromNowhere ? -450 : 1000;
      el.style.marginLeft = `${random(-500, maxMargin)}px`;
      el.style.transform = `scale(${random(0.3, 0.65)})`;

      velocity(el, {
        'margin-left': '100%'
      }, {
        easing: 'linear',
        duration: random(18000, 35000),
        complete: () => {
          applyAnimation(el, true);
        }
      })
    }

    [ ...this.$el.children ].forEach(e => applyAnimation(e))
  }
}
</script>

<style lang="scss">
.cloud-canvas {
  background: #00b4ff;
  bottom: 0;
	left: 0;
	padding-top: 50px;
	position: fixed;
	right: 0;
	top: 0;
  z-index: -1;
  overflow: hidden;

  .cloud {
    background: #fff;
    background: linear-gradient(to bottom,  #fff 5%,#f1f1f1 100%);
    border-radius: 100px;
    box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
    height: 120px;
    position: relative;
    width: 350px;

    &:after,
    &:before {
      content: '';
      background: #fff;
      position: absolute;
      z-indeX: -1;
    }

    &:after {
      border-radius: 100px;
      height: 100px;
      left: 50px;
      top: -50px;
      width: 100px;
    }

    &:before {
      border-radius: 200px;
      width: 180px;
      height: 180px;
      right: 50px;
      top: -90px;
    }
  }
}
</style>
