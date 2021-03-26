/**
 * Issue/Issue.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const {dataTypes} = require('../../enum/data-types.js');

async function processTx(tx, callback) {
  if (tx) return await callback(tx);
  await sails
    .getDatastore()
    .transaction(async tx => await callback(tx));
}

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {type: 'string', required: true},
    resolvedAt: {type: 'number'},
    agreedAt: {type: 'number'},
    closedAt: {type: 'number'},
    submittedAt: {type: 'number'},
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    pathway: {model: 'pathway'},
    org: {model: 'org'},
    type: {
      type: 'string',
      required: true,
      isIn: ['complaint', 'mediation']
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    users: {collection: 'user', via: 'issue', through: 'issueUser'},
    data: {
      collection: 'issueData',
      via: 'issue'
    }

  },

  async updatePartiesState(issueId, tx) {
    await processTx(tx, async tx => {
      const issue = await Issue
        .findOne(issueId)
        .usingConnection(tx);
      if (!issue) throw 'notFound';

      const issueParties = await IssueParty
        .find({
          issue: issueId
        })
        .usingConnection(tx);

      // intentionally doing this to get type name
      const issueData = await IssueData
        .find({
          issue: issueId
        })
        .populate('type')
        .usingConnection(tx);

      // top level steps
      const steps = await PathwayStep
        .find({pathway: issue.pathway})
        .usingConnection(tx);
      for (const step of steps) {
        for (const party of issueParties) {
          await PathwayStep.checkStepConditions(
            step,
            issue,
            issueData,
            party,
            issueParties.length,
            tx
          );
        }
      }

      if (issue.type === 'complaint') {

        if (!issue.resolvedAt) {
          const resolution = issueData.find(
            issueData => issueData.type.id === dataTypes.resolution
          );
          if (resolution) {
            await Issue
              .updateOne(issue.id)
              .set({
                resolvedAt: resolution.createdAt
              })
              .usingConnection(tx);
          }
        }

        if (!issue.agreedAt) {
          const clientAgreed = issueData.find(
            issueData => issueData.type.id === dataTypes.resolutionConfirmed
          );
          if (clientAgreed) {
            await Issue
              .updateOne(issue.id)
              .set({
                closedAt: clientAgreed.createdAt,
                agreedAt: clientAgreed.createdAt
              })
              .usingConnection(tx);
          }
        }

      }

    });
  }

};
