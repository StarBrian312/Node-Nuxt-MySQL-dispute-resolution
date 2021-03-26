

describe('stripe', () => {
  describe('portal', () => {
    const req = async (
      cookie = testOrgAdminCookie
    ) => await request()
      .get('/stripe/portal')
      .set('Cookie', cookie);

    it('should refuse if unpaid', async () => {
      const res = await req();
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq('Org not found or unpaid');
    });

    it('should redirect to portal link', async () => {
      await Org.update(2, {stripeCustomerId: 'cus_IuhTHGIxy5M65y'});
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.redirects.length).to.be.eq(1);
    });

  });
});
