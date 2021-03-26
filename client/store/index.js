

export const actions = {
  async nuxtServerInit({dispatch, commit}, {env}) {
    commit('config/set', env);

    try {
      await dispatch('site/fetchConfig');
      await dispatch('user/me');
    } catch (err) {
      console.log(err);
    }
  }
};
