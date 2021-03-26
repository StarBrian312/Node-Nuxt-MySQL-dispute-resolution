

<template>
  <b-form-group
    :label="title + ':'"
    label-for="gr-select-input"
    :description="description"
  >
    <b-form-select
      id="gr-select-input"
      v-model="$v.form.value.$model"
      :state="validate('value')"
      :options="options"
      aria-describedby="gr-select-feedback"
      :disabled="disabled || ($nuxt.$loading && $nuxt.$loading.show)"
      @change="submit"
    />
    <b-form-invalid-feedback
      id="gr-select-feedback"
    >
      {{ $t('genericRequiredField') }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>

import issueData from '@/mixins/issue-data.js';

export default {
  mixins: [issueData],
  props: {
    options: {type: Array, default: () => ([])}
  }
};
</script>
