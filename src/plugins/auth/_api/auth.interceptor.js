import router from '@/router';
import store from '@/store';

export default (request, next) => {
  const token = window.localStorage.getItem('access_token') || window.sessionStorage.getItem('access_token');

  if (token) {
    request.headers.set('Authorization', 'Bearer ' + token);
    next(response => {
      if (response.status === 401) {
        store.dispatch('logout').then(() => {
          router.replace({
            name: 'signin',
            query: {
              referer: router.currentRoute.path
            }
          });
        });
      }
    });
  }
};
