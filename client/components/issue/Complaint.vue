
<template>
  <div>
    <div class="w-100">
      <b-row
        class="w-100"
        no-gutters
      >
        <b-col cols="12">
          <div class="issue-intro-box">
            <h5
              class="issue-intro-title"
            >
              {{ $t('createComplaintTitle') }}
            </h5>
            <div class="issue-intro-desc">
              <b-form
                @submit.prevent="onSubmit"
              >
                <abn-lookup
                  id="issue-abn-input"
                  v-model="$v.form.abn.$model"
                  :state="validate('abn')"
                />
                <div
                  v-if="$v.form.abn.$dirty && !validate('abn')"
                  class="invalid-feedback"
                  style="display: block;"
                >
                  {{ $t('genericRequiredField') }}
                </div>
              </b-form>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

import form from '@/mixins/form.js';
import {required, alphaNum} from 'vuelidate/lib/validators';

export default {
  mixins: [form],
  data: () => ({
    form: {
      abn: null
    }
  }),
  validations: {
    form: {
      abn: {required, alphaNum}
    }
  },
  methods: {
    async onSubmit() {
      if (this.anyError()) return;
      const {id} = await this.$axios.$post('/issue/complaint', this.form);
      this.$toast.success(
        `${this.$t('newIssueCreatedMsg')}`
      );
      this.$emit('done', {id});
    }
  }
};
</script>
<style scoped>
.issue-intro-box {
  margin: auto;
  max-width: 700px;
}
</style>

