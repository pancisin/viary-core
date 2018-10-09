import Vue from 'vue'
export default baseUrl => {
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

  const refreshToken = (refreshToken, success) => {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }

    Vue.http
      .post(`${API_URL}/oauth/token`, data, {
        emulateJSON: true,
        headers: {
          'Authorization': `Basic ${window.btoa('testjwtclientid:XY7kmzoNzl100')}`
        }
      })
      .then(response => {
        success(response.body);
      })
      .catch(err => {
        if (error) {
          error(err);
        }
      });
  }

  const register = (user, success) => {
    Vue.http.post(`${API_URL}/api/register`, user).then(response => {
      success(response.body);
    });
  }

  const getMe = (success, error) => {
    Vue.http.get(`${ME_API_URL}`).then(response => {
      success(response.body);
    }).catch(err => {
      if (error) {
        error(err);
      }
    });
  }

  return {
    login,
    register,
    getMe,
    refreshToken
  }
};
