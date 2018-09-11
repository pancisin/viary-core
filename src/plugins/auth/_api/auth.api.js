import Vue from 'vue';

export default function (baseUrl) {
  const API_URL = `${baseUrl}`;
  const ME_API_URL = `${baseUrl}/api/v1/user/me`;

  const login = (credentials, success) => {
    var data = {
      ...credentials,
      grant_type: 'password'
    };

    Vue.http
      .post(`${API_URL}/oauth/token`, data, {
        emulateJSON: true,
        headers: {
          'Authorization': `Basic ${window.btoa('testjwtclientid:XY7kmzoNzl100')}`
        }
      })
      .then(response => {
        success(response.body);
      });
  }

  const register = (user, success) => {
    Vue.http.post(`${API_URL}/api/register`, user).then(response => {
      success(response.body);
    });
  }

  const getMe = (success) => {
    Vue.http.get(`${ME_API_URL}`).then(response => {
      success(response.body);
    });
  }

  return {
    login,
    register,
    getMe
  }
};
