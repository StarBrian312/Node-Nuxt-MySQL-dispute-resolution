

<template>
  <div>
    <b>{{ $t('agreementStatus') }}</b>
    <b-list-group flush>
      <b-list-group-item
        v-for=" status in statuses"
        :key="status.id"
      >
        <b-row>
          <b-col class="text-left">
            <h5>
              {{ status.party.name }}
            </h5>
          </b-col>
          <b-col class="text-center">
            <b-icon
              v-if="status.value === 'accepted'"
              icon="check"
              class="icon"
              variant="success"
            />
            <b-icon
              v-else-if="status.value === 'maybe'"
              icon="question"
              class="icon"
              variant="warning"
            />
            <b-icon
              v-else-if="status.value === 'rejected'"
              icon="x"
              class="icon"
              variant="danger"
            />
            <b-icon
              v-else
              icon="question"
              class="icon"
              variant="secondary"
            />
          </b-col>
          <b-col class="text-right">
            <b-dropdown
              v-if="party.id === status.party.id"
              size="sm"
              :text="$t('change')"
              no-caret
              variant="outline-primary"
            >
              <b-dropdown-item
                @click.stop="updateStatus({
                  id: issueId,
                  issueDataId: issueDataId,
                  value: 'accepted'
                })"
              >
                <b-icon
                  icon="check"
                  class="icon"
                  variant="success"
                />
                {{ $t('acceptedStatus') }}
              </b-dropdown-item>
              <b-dropdown-item
                @click.stop="updateStatus({
                  id: issueId,
                  issueDataId: issueDataId,
                  value: 'maybe'
                })"
              >
                <b-icon
                  icon="question"
                  class="icon"
                  variant="warning"
                />
                {{ $t('maybeStatus') }}
              </b-dropdown-item>
              <b-dropdown-item
                @click.stop="updateStatus({
                  id: issueId,
                  issueDataId: issueDataId,
                  value: 'rejected'
                })"
              >
                <b-icon
                  icon="x"
                  class="icon"
                  variant="danger"
                />
                {{ $t('rejectedStatus') }}
              </b-dropdown-item>
              <b-dropdown-item
                @click.stop="updateStatus({
                  id: issueId,
                  issueDataId: issueDataId,
                  value: 'none'
                })"
              >
                <b-icon
                  icon="question"
                  class="icon"
                  variant="seconday"
                />
                {{ $t('noneStatus') }}
              </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex';

export default {
  props: {
    issueId: {type: Number, required: true},
    issueDataId: {type: Number, required: true},
    statuses: {type: Array, default: () => ([])}
  },

  computed: mapGetters({
    party: 'issue/party'
  }),

  async mounted() {
    if (!this.statuses.length) {
      await this.fetch({
        id: this.issueId,
        issueDataId: this.issueDataId
      });
    }
  },

  methods: mapActions({
    fetch: 'issue/fetchIssueDataStatus',
    updateStatus: 'issue/updateIssueDataStatus'
  })
};
</script>

<style lang="scss" scoped>
.list-group-flush > .list-group-item {
  border-width: 0 0 1px;
  border: none;
  padding: 8px 16px;
  font-size: 12px;
}
.card > .list-group {
  padding: 12px 4px 12px;
  border: none;
}

.icon {
  width: 1.5em;
  height: 1.5em;
}

.list-group-item {
  background-color: inherit;
}
</style>
