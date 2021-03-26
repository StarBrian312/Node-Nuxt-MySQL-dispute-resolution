describe('issue', () => {
  describe('submit', () => {
    const req = async (
      id,
      cookie = testOrgUserCookie
    ) => await request()
      .post(`/issue/${id}/submit`)
      .set('Cookie', cookie)
      .send();

    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', testOrgUserCookie)
        .send({
          abn: 11111111111
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should return 400, beacuse of no issue-data goal', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(400);
    });
    it('create issue data', async () => {
      const issueData = await IssueData.create({
        issue: issueId,
        type: 15,
        value: 'goal'});
      expect(issueData).to.be.an('object');
    });

    it('should return submittedAt', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.be.eq(issueId);
      expect(res.body.submittedAt).to.not.equal(0);
    });

    it('when resubmiting, already exist', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(400);
    });

  });
});
