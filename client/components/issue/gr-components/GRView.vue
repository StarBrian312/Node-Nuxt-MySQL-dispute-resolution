

<template>
  <div>
    <h5>
      {{ title }}
    </h5>
    <div v-if="issueData">
      {{ $t(issueData.value) }}
    </div>
    <p v-else>
      {{ $t('providerDetailsViewNoDataYet') }}
    </p>
  </div>
</template>

<script>

import issueData from '@/mixins/issue-data.js';

export default {
  mixins: [issueData],
  props: {
    issueId: {type: Number, default: 0},
    title: {type: String, default: ''}
  }
};
</script>
