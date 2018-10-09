import { getAccessToken, removeAccessToken, setAccessToken } from "../utils";
import Vue from 'vue';

let allowRefresh = true;

export default store => (request, next) => {
  const token = getAccessToken();

  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }

  next(response => {
    if (response.status === 401) {
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
