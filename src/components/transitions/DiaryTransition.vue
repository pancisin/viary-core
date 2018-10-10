<script>
import velocity from 'velocity-animate';

const scaleFactor = 0.98;
const easing = [500, 20];

export default {
  functional: true,
  name: 'diary-transition',
  props: {
    delay: {
      type: Number,
      default () {
        return 150;
      }
    },
    tag: {
      type: String,
      default () {
        return 'div';
      }
    },
    duration: {
      type: Number,
      default() {
        return 500;
      }
    },
  },
  render (h, context) {
    const options = {
      attrs: {
        class: context.data.staticClass
      },
      props: {
        tag: context.props.tag,
        css: false,
        appear: true
      },
      on: {
        beforeEnter: (el) => {
          velocity.hook(el, 'scaleX', scaleFactor);
          velocity.hook(el, 'scaleY', scaleFactor);
          // velocity.hook(el, 'rotateY', '40deg');
          el.style.opacity = 0;
          // el.style.border = '1px solid #ccc'
        },
        enter: (el, done) => {
          const index = [ ...el.parentElement.children ].findIndex(e => e === el);

          velocity(el, {
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            rotateY: 0
          }, {
            duration: context.props.duration,
            delay: index * (context.props.duration * 0.23),
            easing
          }).then(() => {
            if (done) {
              done();
            }
          });
        },
        afterEnter: el => {
          el.removeAttribute('style');
        },
        beforeLeave: (el, done) => {
          el.style.border = '1px solid #ccc'
        },
        leave: (el, done) => {
          const children = [ ...el.parentElement.children ]
          const index = children.findIndex(e => e === el);
          const order = (children.length - 1) - index;
          
          done();
          return;

          velocity(el, {
            opacity: 0,
            scaleX: scaleFactor,
            scaleY: scaleFactor
          }, { 
            duration: context.props.duration, 
            delay: order * (context.props.duration * 0.23),
            easing
          }).then(() => {
            if (done) {
              done()
            }
          });
        },
        afterLeave: el => {
          el.removeAttribute('style');
        }
      }
    };

    return h('transition-group', options, context.children);
  }
};
</script>