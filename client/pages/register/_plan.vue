

<template>
  <BusinessDetail :price-id="priceId" />
</template>

<script>
export default {
  layout: 'pre-auth-form',
  async asyncData({store, params}) {
    return {
      priceId: store.getters['site/plansIndexed'][params.plan].priceId
    };
  }
};
</script>
