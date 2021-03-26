

module.exports = {

  friendlyName: 'Update',

  description: 'Update issue data.',

  inputs: {
    id: {type: 'number', required: true},
    value: {type: 'string', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id, value}) {
    const where = {id, user: this.req.session.userId};
    const issueData = await IssueData.findOne(where).select(['issue']);
    if (!issueData) throw 'notFound';
    await IssueData.update(where).set({value});
    await Issue.updateOne({
      id: issueData.issue
    }).set({updatedAt: new Date().getTime()});
    await Issue.updatePartiesState(issueData.issue);
    return await IssueData.findOne(where);
  }
};
