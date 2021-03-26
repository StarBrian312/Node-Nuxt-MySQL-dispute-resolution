

module.exports = {

  friendlyName: 'Get data',

  description: '',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id: issue}) {
    const issueUser = await IssueUser.findOne({
      user: this.req.session.userId,
      issue
    }).select(['party']);
    if (!issueUser) throw 'notFound';
    const issueData = await IssueData
      .find({issue})
      .populate('type');
    for (let i = 0; i < issueData.length; i++) {
      const data = issueData[i];
      data.statuses = await IssueDataStatus.find({
        issueData: data.id
      }).populate('party');
    }
    return issueData.filter(data => (
      !!data.type.shared || data.party === issueUser.party
    ));
  }

};
