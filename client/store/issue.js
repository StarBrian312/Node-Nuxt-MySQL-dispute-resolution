

import {dataTypes} from '@/constants/data-types.js';

export const state = () => ({
  issue: null,
  steps: [],
  currentStep: null,
  issueData: [],
  party: {}
});

export const mutations = {
  issue: (state, issue) => state.issue = issue,

  steps: (state, steps) => state.steps = steps
    .filter(step => step.state.show)
    .map(step => ({
      ...step,
      steps: step.steps.filter(step => step.state.show)
    })),
  currentStep: (state, step) => state.currentStep = step,
  issueData: (state, issueData) => state.issueData = issueData,
  party: (state, party) => state.party = party,

  initStep: state => {
    const setSteps = state.steps.filter(
      step => step.state.enabled && !step.state.completed
    );
    state.currentStep = setSteps[setSteps.length - 1];
  }
};

export const getters = {
  issue: state => state.issue,

  steps: state => state.steps,
  currentStep: state => state.currentStep,
  issueData: state => state.issueData,
  party: state => state.party || {},

  issueCategory: state => state.issueData
    .find(issueData => issueData.type.id === dataTypes.issueCategory),
  issueSubCategory: state => state.issueData
    .find(issueData => issueData.type.id === dataTypes.issueSubCategory)
};

export const actions = {
  async fetch({commit, dispatch}, id) {
    let party;
    try {
      party = await this.$axios.$get(`/issue/${id}/party`);
    } catch (err) {
      if (err.response.status === 404) {
        await dispatch('join', {id});
        party = await this.$axios.$get(`/issue/${id}/party`);
      } else {
        this.$toast.error(
          `${this.i18n.t('error')}: ${this.i18n.t('forbidden')}`
        );
      }
    }
    commit('party', party);
    commit('issue', await this.$axios.$get(`/issue/${id}`));
    commit('steps', await this.$axios.$get(`/issue/${id}/steps`));
    await dispatch('fetchIssueData', {id});
  },

  async fetchIssueData({commit}, {id}) {
    commit('issueData', await this.$axios.$get(`/issue/${id}/data`));
  },

  async createIssueData({dispatch}, {id, data}) {
    await this.$axios.$post(`/issue/${id}/data`, data);
    await dispatch('fetch', id);
  },

  async join(ctx, {id}) {
    await this.$axios.$post(`/issue/${id}/join`);
  },

  async updateIssueData({dispatch}, {id, issueDataId, data}) {
    await this.$axios.$put(`/issue-data/${issueDataId}`, data);
    await dispatch('fetch', id);
  },

  async deleteIssueData({dispatch}, {id, issueDataId}) {
    await this.$axios.$delete(`/issue-data/${issueDataId}`);
    await dispatch('fetch', id);
  },

  async fetchIssueDataStatus({dispatch}, {id, issueDataId}) {
    await this.$axios.$get(`/issue-data/${issueDataId}/status`);
    await dispatch('fetchIssueData', {id});
  },

  async updateIssueDataStatus({dispatch}, {id, issueDataId, value}) {
    await this.$axios.$put(
      `/issue-data/${issueDataId}/status`,
      {value}
    );
    await dispatch('fetchIssueData', {id});
  }
};
