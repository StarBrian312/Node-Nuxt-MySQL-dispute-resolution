

export const state = () => ({
  config: {}
});

export const getters = {
  get: state => state.config
};

export const mutations = {
  set: (state, config) => state.config = config
};
