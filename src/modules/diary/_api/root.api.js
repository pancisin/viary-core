import Vue from "vue";
export default baseUrl => {
  const ROOT_API_URL = `${baseUrl}/api/v1`;

  const getInitial = success => {
    Vue.http.get(`${ROOT_API_URL}/initial`).then(response => {
      success(response.body);
    });
  };

  return {
    getInitial
  };
};
