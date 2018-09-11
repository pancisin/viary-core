const updateLoader = (el, value) => {
  const children = Array.from(el.childNodes);
  const loader = children.filter(e => e.classList != null && e.classList.contains('loader'))[0];

  const percentage = loader.getElementsByClassName('percentage')[0];
  percentage.style = {
    display: value && value !== true ? 'inline-block' : 'none'
  };

  loader.classList.toggle('percentage-visible', value && value !== true);

  percentage.innerText = value !== true && value !== false ? `${Math.round(value)}%` : '';
};

export default {
  bind (el, binding, node) {
    el.style.position = 'relative';

    var loader = document.createElement('div');
    var spinner = document.createElement('div');
    var percentage = document.createElement('span');

    spinner.className = 'spinner';
    loader.appendChild(spinner);
    loader.className = 'loader';
    percentage.className = 'percentage';
    loader.appendChild(percentage);

    el.appendChild(loader);
  },
  inserted (el, binding) {
    el.classList.toggle('_loading', binding.value);
    updateLoader(el, binding.value);
  },
  update (el, binding, node) {
    el.classList.toggle('_loading', binding.value);
    updateLoader(el, binding.value);
  }
};
