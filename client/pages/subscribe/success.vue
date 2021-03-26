<template>
  <b-row class="mt-4 justify-content-md-center">
    <b-col
      md="7"
      cols="9"
    >
      <div class="mt-5">
        <b-alert
          show
          class="py-4"
          variant="success"
        >
          <h4 class="alert-heading">
            {{ $t(`paymentsuccess`) }}
          </h4>
          <p>
            {{ $t(`paymentsuccesscontent`) }}
          </p>
          <hr>
          <p class="mb-0">
            <nuxt-link :to="`/`">
              {{ $t(`backToHomepahe`) }}
            </nuxt-link>
          </p>
        </b-alert>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  async asyncData({store}) {
    await store.dispatch('user/me');
  },
  mounted() {
    this.$toast.success(
      `${this.$t('successfulSignIn')}`
    );
    this.$router.push('/');
  }
};
</script>
