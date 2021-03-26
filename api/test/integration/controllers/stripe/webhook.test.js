

describe('stripe', () => {
  describe('webhook', () => {

    const req = async (data = {}) => await request()
      .post('/stripe/webhook')
      .send(data);

    it('[checkout.session.completed]', async () => {
      const sessionId = 'test_id';
      const customer = 'test_customer';

      const {id} = await Org.create({
        name: 'webhook_test_org',
        slug: 'webhook-test-org',
        stripeSessionId: sessionId,
        abn: 81910463257
      }).fetch();

      const res = await req({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: sessionId,
            customer
          }
        }
      });
      expect(res.status).to.be.eq(200);

      const org = await Org.findOne(id);
      expect(org.subscriptionStatus).to.be.eq('active');
      expect(org.stripeCustomerId).to.be.eq(customer);
    });

    it('[customer.subscription.updated]', async () => {
      const customer = 'test_customer_1';
      const status = 'incomplete';
      const plan = 'test_planId';

      const {id} = await Org.create({
        name: 'webhook_test_org_1',
        slug: 'webhook-test-org-one',
        stripeCustomerId: customer,
        abn: 13285469117
      }).fetch();

      const res = await req({
        type: 'customer.subscription.updated',
        data: {
          object: {
            customer,
            status,
            plan: {id: plan}
          }
        }
      });
      expect(res.status).to.be.eq(200);

      const org = await Org.findOne(id);
      expect(org.subscriptionStatus).to.be.eq(status);
      expect(org.priceId).to.be.eq(plan);
    });

  });
});
