module.exports = {

  friendlyName: 'Stripe',

  fn: async () => {
    const stripeSecretKey = await SiteConfig
      .findOne({where: {key: 'stripeSecretKey'}, select: ['value']});
    return require('stripe')(stripeSecretKey.value);
  }
};
