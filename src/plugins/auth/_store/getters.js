export default {
  user: state => state.user,
  authenticated: state => state.authenticated,
  loadingUser: state => state.loadingUser,
  loading: state => state.loginInProgress || state.registerInProgress || state.loadingUser
};