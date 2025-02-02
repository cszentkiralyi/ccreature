const State = () => ({ toasts: [] });

const Actions = {
  addToast: (state, t) => state.toasts = state.toasts.concat(t),
  dropToast: (state) => state.toasts = state.toasts.slice(1, state.toasts.length - 2),

  showSidebar: (state) => state.sidebar = true,
  hideSidebar: (state) => state.sidebar = false
};

module.exports = {
  State, Actions
};