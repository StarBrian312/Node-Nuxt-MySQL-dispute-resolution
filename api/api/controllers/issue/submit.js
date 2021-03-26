
const {dataTypes} = require('../../enum/data-types.js');
module.exports = {

  friendlyName: 'Update',

  description: 'Update issue',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    },
    noReadySubmit: {
      responseType: 'badRequest'
    }
  },

  fn: async function({id}) {
    const user = this.req.session.userId;
    const where = {issue: id, user};
    const issueUserExist = await IssueUser.findOne(where);
    if (!issueUserExist) throw 'notFound';
    const submitReady = await IssueData
      .findOne(
        {
          user,
          issue: id,
          type: dataTypes.goals
        }
      );
    if (!submitReady) throw {
      noReadySubmit: {
        message: sails.__('You must first enter goals')
      }
    };
    const updateData = {
      submittedAt: +new Date()
    };
    return await Issue.updateOne({
      id,
      submittedAt: 0
    }).set(updateData);
  }
};
