<template>
  <div class="wrapper-abn-inputs">
    <div v-if="showOrgNotFound">
      <h5 class="text-danger mb-3">
        {{ $t('ABNLookupNoOrgFound') }}
      </h5>
    </div>
    <div v-if="!orgs.length">
      <b-form-group
        :label="$t('enterAbn')"
        label-for="abn-input"
        label-cols-sm="4"
        label-align-sm="right"
        class="mt-2"
      >
        <b-form-input
          id="abn-input"
          v-model="$v.form.abn.$model"
          :state="validate('abn')"
          :placeholder="$t('abnExample')"
          type="text"
          debounce="500"
          autocomplete="off"
          aria-describedby="abn-input-feedback"
        />
        <b-form-invalid-feedback
          id="abn-input-feedback"
        >
          {{ $t(`11numbers`) }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('findCompanyByName')"
        label-for="name-input"
        label-cols-sm="4"
        label-align-sm="right"
      >
        <b-form-input
          id="name-input"
          v-model="$v.form.name.$model"
          :placeholder="$t('nameExample')"
          type="text"
          :state="validate('name')"
          debounce="500"
          autocomplete="off"
          aria-describedby="name-input-feedback"
        />
        <b-form-invalid-feedback
          id="name-input-feedback"
        >
          {{ $t(`genericFieldString`) }}
        </b-form-invalid-feedback>
      </b-form-group>

      <div
        v-if="($v.form.abn.$dirty || $v.form.name.$dirty) && !$v.form.any"
        class="invalid-feedback"
        style="display: block;"
      >
        {{ $t('oneOfTheFieldsIsRequired') }}
      </div>
      <div class="text-center">
        <b-button
          variant="primary"
          :disabled="$nuxt.$loading && $nuxt.$loading.show"
          class="mt-2"
          @click="lookup"
        >
          {{ $t('submit') }}
        </b-button>
      </div>
    </div>

    <div v-if="orgs.length">
      <b-list-group class="mb-4">
        <h4 class="mt-2 mb-4">
          {{ $t('selectAnOrg') }}
        </h4>
        <b-list-group-item
          v-for="org in orgs"
          :key="org.abn"
          button
          :active="selectedOrg && selectedOrg.abn === org.abn"
          class="item-abn"
          @click="selectedOrg = org"
        >
          {{ org.name }} | {{ org.abn }}
        </b-list-group-item>
      </b-list-group>
      <div class="text-right">
        <small>{{ $t('abnLokkupCompanyNOtFoundTip') }}</small>
      </div>
      <b-button
        variant="outline-warning"
        :disabled="$nuxt.$loading && $nuxt.$loading.show"
        class="mt-2"
        @click="orgs = []"
      >
        {{ $t('searchAgain') }}
      </b-button>
      <b-button
        type="submit"
        variant="outline-primary"
        :disabled="($nuxt.$loading && $nuxt.$loading.show) && !!selectedOrg"
        class="mt-2"
      >
        {{ $t('proceedWithSelected') }}
      </b-button>
    </div>

    <Loading :loading="loading" />
  </div>
</template>

<script>

import form from '@/mixins/form.js';
import {required} from 'vuelidate/lib/validators';
import {abn} from '@/validators/index.js';

export default {
  mixins: [form],
  props: {
    value: {type: Number, default: 0}
  },
  data: () => ({
    loading: false,
    selectedOrg: null,
    orgs: [],
    showOrgNotFound: false,
    form: {
      abn: '',
      name: ''
    }
  }),
  validations: {
    form: {
      any(form) {
        if (form.abn) {
          this.$v.form.name.$reset();
          return this.validate('abn');
        } else if (form.name) {
          this.$v.form.abn.$reset();
          return this.validate('name');
        } else {
          return false;
        }
      },
      abn: {required, abn},
      name: {required}
    }
  },
  watch: {
    orgs() {
      if (this.orgs.length > 0) {
        this.selectedOrg = this.orgs[0];
      } else {
        this.selectedOrg = null;
      }
    },
    selectedOrg() {
      if (this.selectedOrg) {
        this.$emit('input', this.selectedOrg.abn);
        this.$emit('name', this.selectedOrg.name);
      } else {
        this.$emit('input', null);
      }
    }
  },
  methods: {
    async lookup() {
      if (!this.$v.form.any) {
        if (!this.abn) this.$v.form.abn.$touch();
        if (!this.name) this.$v.form.name.$touch();
        return;
      }

      this.loading = true;
      const params = {};

      if (this.form.abn) {
        params.abn = this.form.abn.replace(/ /g, '');
      }
      if (this.form.name) {
        params.name = this.form.name;
      }

      try {
        this.orgs = await this.$axios.$get('/org/lookup', {params});
        this.showOrgNotFound = this.orgs.length === 0;
      } catch (err) {
        console.error(err);
        this.$toast.error('Server error');
      }

      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";

.wrapper-input-label label {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  height: 100%;
}

.item-abn{
  &.active{
    background: $color_primary;
    border: none;
    outline: none;
    opacity: 0.9;
  }

  .wrapper-abn-inputs {
    text-align: center;
  }

}
</style>
