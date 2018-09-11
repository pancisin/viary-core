export default {
  user: state => state.user,
  authenticated: state => {
    return (
      state.authenticated ||
      window.localStorage.getItem('access_token') != null ||
      window.sessionStorage.getItem('access_token') != null
    );
  },
  loadingUser: state => state.loadingUser
};