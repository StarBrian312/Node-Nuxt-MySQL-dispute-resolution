

<template>
  <div>
    <issue-intro
      :title="$t('responderDetailsStepIntroTitle')"
      :desc="$t('responderDetailsStepIntroDesc')"
    />
    <div class="wrapper-content-issue">
      <gr-view
        class="mt-4"
        :type-id="dataTypes.issueSector"
        :title="$t('issueSectorTitle')"
      />

      <gr-view
        class="mt-4"
        :type-id="dataTypes.issueCategory"
        :title="$t('issueCategoryTitle')"
      />

      <gr-view
        class="mt-4"
        :type-id="dataTypes.issueSubCategory"
        :title="$t('issueSubCategoryTitle')"
      />

      <gr-view
        class="mt-4"
        :type-id="dataTypes.whatHappened"
        :title="$t('whatHappenedTitle')"
      />

      <gr-view
        class="mt-4"
        :type-id="dataTypes.expectations"
        :title="$t('expectationsResponderTitle')"
      />
    </div>

    <div />
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
export default {
  data() {
    return {dataTypes};
  }
};
</script>
