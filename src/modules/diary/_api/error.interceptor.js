import Vue from "vue";

export default store => (request, next) => {
  next(response => {
    if (!response.ok && response.status === 0) {
      store.dispatch('$_settings/switchOfflineMode', true)
    }
  });
};
