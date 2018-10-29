import Vue from "vue";
export default baseUrl => {
  const ROOT_API_URL = `${baseUrl}/api/v1`;

  const getInitial = success => {
    Vue.http.get(`${ROOT_API_URL}/initial`).then(response => {
      success(response.body);
    });
  };

  const updateUserPreference = (preferenceKey, value) => {
    return Vue.http.put(`${ROOT_API_URL}/user/me/preference`, {
      preference_key: preferenceKey,
      value
    }).then(response => {
      return Promise.resolve(response.body)
    })
  }

  return {
    getInitial,
    updateUserPreference
  };
};
