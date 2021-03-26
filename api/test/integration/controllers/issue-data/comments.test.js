

describe('issue-data', () => {
  describe('comments', () => {
    const req = async (
      id,
      cookie = userCookie
    ) => await request()
      .get(`/issue-data/${id}/comments`)
      .set('Cookie', cookie);

    let issueId = null;
    let id = null;
    let party = null;

    before(async () => {
      let res = await request()
          .post('/issue/complaint')
          .set('Cookie', userCookie)
          .send({
            name: 'myIssue',
            abn: 13069942552
          });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
      res = await request()
          .post(`/issue/${issueId}/data`)
          .set('Cookie', userCookie)
          .send({
            value: 'test',
            type: 1
          });
      id = res.body.id;
      party = res.body.party;
    });

    it('should return list of comments for an issue-data', async () => {
      const text = 'test';
      const issueData = id;
      const _party = party;
      const user = 6;
      await IssueDataComment.create({
        text,
        issueData,
        party: _party,
        user
      });
      const res = await req(issueDataId);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].text).to.be.eq(text);
      expect(res.body[0].issueData).to.be.eq(issueData);
      expect(res.body[0].party).to.be.eq(_party);
      expect(res.body[0].user).to.be.eq(user);
    });

    it('should refuse to return comments if in party', async () => {
      const res = await req(issueDataId, testOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });
  });
});
