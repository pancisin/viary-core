import { getAccessToken, removeAccessToken, setAccessToken, getRefreshToken } from "../utils";
import Vue from 'vue';

let allowRefresh = true;

export default store => (request, next) => {
  const token = getAccessToken();

  if (token != null) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }

  next(response => {
    if (response.status === 401 && getRefreshToken() != null) {
      allowRefresh = false;
      removeAccessToken();
      return store.dispatch('$_auth/refreshLogin').then(result => {
        request.headers.set("Authorization", `Bearer ${result.access_token}`);

        return Vue.http(request).then(data => {
          return data
        })
      }, () => {
        store.dispatch("$_auth/logout")
      })
    }
  });
};
