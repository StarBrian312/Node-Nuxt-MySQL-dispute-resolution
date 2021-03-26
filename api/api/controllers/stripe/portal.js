module.exports = {

  friendlyName: 'Stripe get portal link',

  description: 'Get link to accept Stripe portal',

  exits: {
    orgNotFound: {responseType: 'badRequest'}
  },

  fn: async function() {
    const org = await Org.findOne(this.req.session.orgId);
    if (!org || !org.stripeCustomerId) throw {
      orgNotFound: {
        message: sails.__('Org not found or unpaid')
      }
    };
    const stripe = await sails.helpers.stripe();
    const session = await stripe.billingPortal.sessions.create({
      'customer': org.stripeCustomerId,
      'return_url': `${sails.config.custom.clientURL}`
    });
    this.res.redirect(session.url);
  }
};
