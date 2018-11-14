const baseUrl = () => {
  const url = window.location;
  return `${url.protocol}//${url.host}/${url.pathname.split('/')[1]}`;
};

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const colorLightness = c => {
  var c = c.substring(1);
  var rgb = parseInt(c, 16);
  var r = (rgb >> 16) & 0xff;
  var g = (rgb >>  8) & 0xff;
  var b = (rgb >>  0) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const normalizePath = ( ...path ) => {
  return path.join('/').split('/').filter(p => p).join('/')
}

export { 
  baseUrl, 
  guid, 
  colorLightness,
  normalizePath
};
