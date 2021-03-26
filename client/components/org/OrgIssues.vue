

<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <Table
          id="users-list"
          :fields="fields"
          :items="issues"
          :slots="['age']"
          identity="org/issues"
          :excel="true"
          :search-fields="['issueName', 'firstName', 'lastName', 'email']"
          no-items-message="noComplaintsOrgList"
        >
          <template #age="{data}">
            <p :style="getCss(data.item.age)">
              {{ data.item.age }}
            </p>
          </template>
        </Table>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="org/issues" />
      </b-col>
    </b-row>
  </div>
</template>
<script>

import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id'},
        {label: this.$t('age'), key: 'age'},
        {label: this.$t('name'), key: 'name'},
        {label: this.$t('recordedAt'), key: 'recordedAt'},
        {label: this.$t('lastActivity'), key: 'lastActivity'},
        {label: this.$t('issuesListResolutionOffered'), key: 'resolvedAt'},
        {label: this.$t('issuesListAgreedAt'), key: 'agreedAt'},
        {label: this.$t('issuesListClosed'), key: 'closedAt'},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      orgIssues: 'org/issues/data'
    }),
    issues() {
      return this.orgIssues.map(({
        id,
        name,
        resolvedAt,
        updatedAt,
        submittedAt,
        agreedAt,
        closedAt
      }) => ({
        id,
        age: this.$moment().diff(this.$moment(submittedAt), 'days'),
        name,
        recordedAt: this.$moment(submittedAt).format('DD MMM YY'),
        lastActivity: this.$moment(updatedAt).format('DD MMM YY'),
        resolvedAt: (resolvedAt ? this.$moment(resolvedAt).format('DD MMM YY') : '-'),
        agreedAt: (agreedAt ? this.$moment(agreedAt).format('DD MMM YY') : '-'),
        closedAt: (closedAt ? this.$moment(closedAt).format('DD MMM YY') : '-'),
        actions: [
          {
            text: this.$t('view'),
            type: 'button',
            variant: 'link',
            to: `/issue/${id}`,
            disabled: false
          }
        ]
      }));
    }
  },
  methods: {
    getCss(age) {
      if (age > 30) return 'color: red';
      else if (age > 20) return 'color: orange';
      else return '';
    }
  }
};
</script>
