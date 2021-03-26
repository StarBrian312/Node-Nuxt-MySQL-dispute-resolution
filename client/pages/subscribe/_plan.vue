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
              {{ $t('yourCompanyDetails') }}
            </h5>
            <div class="issue-intro-desc">
              <b-form
                v-if="!abnSelected"
                @submit.prevent="abnSelected = true"
              >
                <b-form-group
                  :label="fidnOrgMsg"
                  label-for="issue-abn-input"
                >
                  <abn-lookup
                    id="issue-abn-input"
                    v-model="abn"
                    @name="_name => name = _name"
                  />
                </b-form-group>
              </b-form>
              <div v-else>
                <EndUserDetail
                  :abn="abn"
                  :price-id="priceId"
                  :name="name"
                />
                <b-button
                  variant="primary"
                  class="mt-2"
                  :disabled="$nuxt.$loading && $nuxt.$loading.show"
                  @click="abnSelected = false; abn = 0"
                >
                  {{ $t('searchAgain') }}
                </b-button>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  async asyncData({store, params}) {
    return {
      priceId: store.getters['site/plansIndexed'][params.plan].priceId
    };
  },
  data() {
    return {
      abn: null,
      name: null,
      abnSelected: false
    };
  },
  computed: {
    fidnOrgMsg() {
      if (this.abn) {
        return '';
      } else {
        return this.$t('findOrg');
      }
    }
  },
  methods: {
    next() {
      this.abnSelected = true;
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
