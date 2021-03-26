
module.exports = {

  friendlyName: 'Create data',

  description: '',

  inputs: {
    id: {type: 'number', required: true},
    value: {type: 'string', required: true},
    type: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({
    id: issue,
    value,
    type
  }) {
    const user = this.req.session.userId;
    const issueUser = await IssueUser.findOne({
      user,
      issue
    }).select(['party']);
    if (!issueUser) throw 'notFound';

    const issueData = await IssueData.create({
      value,
      user,
      issue,
      type,
      party: issueUser.party
    }).fetch();

    await Issue.updateOne(issue)
      .set({
        updatedAt: new Date().getTime()
      });

    await Issue.updatePartiesState(issue);

    return issueData;
  }

};
