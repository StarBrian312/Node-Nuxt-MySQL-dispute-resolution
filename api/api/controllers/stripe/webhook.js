module.exports = {

  friendlyName: 'Stripe web hook business',

  description: 'Update by type in webhook',

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function() {
    const event = this.req.allParams();
    const {type} = event;
    const data = event.data.object;
    const {customer, status, plan} = data;

    if (type === 'checkout.session.completed') {
      const stripeSessionId = data.id;
      await Org.update({stripeSessionId}, {
        subscriptionStatus: 'active',
        stripeCustomerId: customer,
        active: true
      });
    }

    if (type === 'customer.subscription.updated') {
      await Org.update({stripeCustomerId: customer}, {
        subscriptionStatus: status,
        priceId: plan.id
      });

    }

    return;
  }
};
