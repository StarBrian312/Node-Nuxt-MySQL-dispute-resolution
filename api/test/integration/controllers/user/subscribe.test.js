

describe('user', () => {
  describe('subscribe', () => {
    it('should refuse if request with http', async () => {
      const res = await request()
        .post('/user/subscribe')
        .set('Cookie', userCookie)
        .send();
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'This request is socket only'
      );
    });

    it('should be able to call subscribe', async () => {
      const res = await new Promise(resolve => {
        io.socket.post('/user/subscribe', (body, jwr) => resolve(jwr));
      });
      expect(res.statusCode).to.be.eq(200);
    });

    it('should receive published events after subscribe', done => {
      const data = {foo: 'bar'};
      io.socket.on('user', msg => {
        expect(msg).to.be.eql(data);
        done();
      });
      User.publish([6], data);
    });

  });
});
