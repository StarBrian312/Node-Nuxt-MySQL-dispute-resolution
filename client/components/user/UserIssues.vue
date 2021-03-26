
<template>
  <div>
    <b-row class="mt-2">
      <b-col class="d-flex flex-row justify-content-center align-items-center">
        <b-button
          size="lg"
          class="dashed-button d-flex flex-row justify-content-center align-items-center"
          to="/issue/create-complaint"
        >
          <b-icon icon="plus-circle-fill" />
          <span class="ml-3"> {{ $t("newComplaint") }} </span>
        </b-button>
      </b-col>
    </b-row>
    <b-row
      v-if="issues.length"
      class="mt-2"
    >
      <b-col>
        <b-form-group>
          <b-form-radio-group
            id="btn-radios-2"
            v-model="tableView"
            :options="[
              {text: $t('cardView'), value: false},
              {text: $t('tableView'), value: true}
            ]"
            button-variant="outline-primary"
            buttons
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <h3 class="mt-5 text-center">
          {{ $t('noIssuesyet') }}
        </h3>
      </b-col>
    </b-row>
    <b-row v-if="!tableView">
      <b-col>
        <IssuesCardView
          :issues="issues"
        />
      </b-col>
    </b-row>
    <b-row v-if="tableView">
      <b-col>
        <Table
          :fields="fields"
          :items="issues"
          :slots="['age']"
          identity="user/issues"
        >
          <template #age="{data}">
            <p :style="getCss(data.item.age)">
              {{ data.item.age }}
            </p>
          </template>
        </Table>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col
        class="d-flex flex-row justify-content-center"
      >
        <Pagination identity="user/issues" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex';
import {roleMixin} from '@/mixins/roleMixin.js';

export default {
  mixins: [roleMixin],
  data() {
    const formatter = value => {
      if (!value) return '-';
      else return value;
    };
    return {
      fields: [
        {label: this.$t('idTitle'), key: 'id'},
        {label: this.$t('age'), key: 'age'},
        {label: this.$t('name'), key: 'name'},
        {label: this.$t('recordedAt'), key: 'recordedAt'},
        {label: this.$t('lastActivity'), key: 'lastActivity'},
        {
          label: this.$t('issuesListResolutionOffered'),
          key: 'resolvedAt',
          formatter
        },
        {
          label: this.$t('participantIssuesListAgreedAt'),
          key: 'agreedAt',
          formatter
        },
        {
          label: this.$t('issuesListClosed'),
          key: 'closedAt',
          formatter
        },
        {label: this.$t('actions'), key: 'actions'}
      ],
      tableView: false
    };
  },
  async fetch() {
    await this.fetchIssues();
  },
  computed: {
    ...mapGetters({
      storedIssues: 'user/issues/data',
      siteType: 'site/type',
      orgs: 'user/orgs'
    }),
    issues() {
      return this.storedIssues.map(({
        id,
        name,
        resolvedAt,
        createdAt,
        updatedAt,
        parties,
        agreedAt,
        closedAt
      }) => ({
        id,
        age: (() => {
          const diffTimestamp = +new Date() - createdAt;
          const diffDays = this.$moment.duration(diffTimestamp, 'milliseconds').asDays();
          return parseInt(diffDays);
        })(),
        name: (() => {
          const responder = parties
            .find(party => party.type === 'responder');
          if (responder && this.siteType === 'complaints') {
            return responder.name;
          } else {
            return name;
          }
        })(),
        recordedAt: this.$moment(createdAt).format('DD MMM YYYY'),
        lastActivity: this.$moment(updatedAt).format('DD MMM YYYY'),
        resolvedAt: (
          resolvedAt ?
          this.$moment(resolvedAt).format('DD MMM YY') :
          null
        ),
        agreedAt: (
          agreedAt ?
          this.$moment(agreedAt).format('DD MMM YY') :
          null
        ),
        closedAt: (
          closedAt ?
          this.$moment(closedAt).format('DD MMM YY') :
          null
        ),
        actions: (() => {
          const actions = [];
          if (!closedAt) {
            actions.push({
              text: this.$t('view'),
              to: `/issue/${id}`,
              disabled: !!closedAt
            });
          }
          if (resolvedAt) {
            actions.push({
              text: this.$t('downloadPDF'),
              disabled: !!resolvedAt,
              to: `/issue/${id}/download-pdf`,
              target: '_blank'
            });
          }
          return actions;
        })()
      }));
    }
  },
  methods: {
    ...mapActions({fetchIssues: 'user/issues/fetch'}),
    getCss(age) {
      if (age > 30) return 'color: red';
      else if (age > 20) return 'color: orange';
      else return '';
    }
  }
};
</script>
