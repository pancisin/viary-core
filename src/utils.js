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

export { baseUrl, guid };
