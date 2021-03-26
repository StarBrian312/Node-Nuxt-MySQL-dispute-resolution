

describe('org', () => {
  describe('register', () => {
    const req = async (
      data = {}
    ) => await request()
      .post('/org/register')
      .send(data);

    it('should register org', async () => {
      const email = 'test@test.org';
      const firstName = 'testTest';
      const lastName = 'testTest';
      const company = 'testTest';
      const phone = '77777777777';
      const abn = 70009658520;
      const website = 'test.com';
      const res = await req({
        email,
        firstName,
        lastName,
        company,
        phone,
        abn,
        website,
        priceId: 'price_1IGfXyCqgyRei99md8UMtFsN'
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.stripeSessionId).to.be.a('string');
      const org = await Org.findOne({abn});
      expect(org).to.be.an('object');
      expect(org.name).to.be.eq(company);
      expect(org.phone).to.be.eq(phone);
      expect(org.website).to.be.eq(website);
    });
  });
});
