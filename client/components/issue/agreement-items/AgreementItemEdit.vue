

<template>
  <b-card
    no-body
  >
    <b-card-body>
      <gr-textarea
        v-if="party.id === issueData.party"
        :title="$t('agreementItemTitle')"
        :issue-id="issueId"
        :type-id="dataTypes.agreementItem"
        :issue-data-id="issueData.id"
        :validations="{required, maxChars: maxLength(250)}"
        disable-clear
      />
      <p v-else>
        {{ issueData.value }}
      </p>
    </b-card-body>

    <b-card-body class="divider">
      <agreement-item-status
        :issue-id="issueId"
        :issue-data-id="issueData.id"
        :statuses="issueData.statuses"
      />
    </b-card-body>

    <!-- <b-card-body class="divider text-center">
      <div>
        12 Comments
      </div>
      <div class="mt-2">
        <b-button
          class="w-100 comment-btn"
          variant="outline-primary"
        >
          Discussion
        </b-button>
      </div>
    </b-card-body> -->
  </b-card>
</template>

<script>

import {mapGetters} from 'vuex';
import {dataTypes} from '@/constants/data-types.js';
import {required, maxLength} from 'vuelidate/lib/validators';

export default {
  props: {
    issueId: {type: Number, required: true},
    issueData: {type: Object, required: true}
  },

  data: () => ({dataTypes, required, maxLength}),

  computed: mapGetters({
    party: 'issue/party'
  })
};
</script>

<style lang="scss" scoped>

@import "@/assets/style/modules/colors";

.card-body {
  background: none;
  font-weight: bold;
  padding: 10px;
  padding-top: 16px;
}

.divider {
  border-top: 1px solid $color_accent;
}
</style>
