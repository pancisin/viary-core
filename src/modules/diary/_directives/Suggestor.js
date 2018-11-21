export default {
  bind (el, binding, vnode) {
    const options = binding.value || {};
    console.warn(vnode)
    el.addEventListener('input', e => {
      if (e.data === '@') {

        console.warn(options.options)
      }
    })
  }
}