

describe('Org', () => {
  describe('#find', () => {
    it('should sanitize org in json', async () => {
      const org = await Org.findOne(1);
      expect(org).to.be.an('object');
      const sanitizedOrg = JSON.parse(JSON.stringify(org));
      expect(sanitizedOrg).to.not.have.property('createdAt');
      expect(sanitizedOrg).to.not.have.property('updatedAt');
    });
  });

  describe('#create', () => {
    it('should be able to create an org', async () => {
      const name = 'myOrg';
      const abn = 75368429111;
      const slug = 'my-org';
      const org = await Org.create({
        name,
        abn,
        slug
      }).fetch();
      expect(org.name).to.be.eq(name);
      expect(org.abn).to.be.eq(abn);
      expect(org.slug).to.be.eq(slug);
      expect(org.active).to.be.eq(true);
    });

    it('should sanitize org in json', async () => {
      const name = 'sanitize';
      const abn = 53622234511;
      const org = await Org.create({
        name,
        abn
      }).fetch();
      expect(org).to.be.an('object');
      const sanitizedOrg = JSON.parse(JSON.stringify(org));
      expect(sanitizedOrg).to.not.have.property('createdAt');
      expect(sanitizedOrg).to.not.have.property('updatedAt');
      expect(sanitizedOrg).to.not.have.property('plan');
      expect(sanitizedOrg).to.not.have.property('priceId');
      expect(sanitizedOrg).to.not.have.property('stripeSessionId');
      expect(sanitizedOrg).to.have.property('stripeCustomerId');
    });

    it('should create slug', async () => {
      const org = await Org.create({
        name: 'My Test Org',
        abn: 12345428901
      }).fetch();
      expect(org.slug).to.be.eq('my-test-org');
    });
  });

  describe('update', () => {
    it('should fail if trying to set no slug', async () => {
      const org = await Org.create({
        name: '99org',
        abn: 99999999999
      }).fetch();
      let err = null;
      try {
        await Org.updateOne(org.id).set({slug: ''});
      } catch (_err) {
        err = _err;
      }
      expect(err).to.be.an('object');
      try {
        await Org.updateOne(org.id).set({slug: null});
      } catch (_err) {
        err = _err;
      }
      expect(err).to.be.an('object');
    });
  });
});
