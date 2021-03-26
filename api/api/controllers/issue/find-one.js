

const {dataTypes} = require('../../enum/data-types.js');

module.exports = {

  friendlyName: 'Find one',

  description: '',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}) {
    const issueUser = await IssueUser.findOne({
      user: this.req.session.userId,
      issue: id
    }).select(['id']);
    if (!issueUser) throw 'notFound';
    const issue = await Issue.findOne(id);
    issue.parties = await IssueParty.find({
      issue: issue.id
    });
    issue.resolution = await IssueData.findOne({
      issue: issue.id,
      type: dataTypes.resolutionConfirmed
    });
    return issue;
  }

};
