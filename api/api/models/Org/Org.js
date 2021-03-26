/**
 * Org.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {type: 'string', required: true},
    website: {type: 'string'},
    phone: {type: 'string'},
    abn: {
      type: 'number',
      required: true,
      unique: true,
      custom: abn => sails.helpers.validate.abn(abn)
    },

    active: {
      type: 'boolean',
      defaultsTo: true
    },

    slug: {
      type: 'string',
      unique: true,
      custom: (s) => sails.helpers.validate.slug(s)
    },

    plan: {
      type: 'string'
    },
    priceId: {
      type: 'string'
    },
    stripeCustomerId: {
      type: 'string'
    },
    stripeSessionId: {
      type: 'string'
    },
    subscriptionStatus: {
      type: 'string',
      isIn: [
        'incomplete',
        'incomplete_expired',
        'trialing',
        'active',
        'past_due',
        'canceled',
        'unpaid'
      ],
      defaultsTo: 'incomplete'
    },
    trialEnds: {
      type: 'boolean'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    orgUsers: {collection: 'orgUser', via: 'org'},
    users: {collection: 'user', via: 'org', through: 'orgUser'}

  },

  customToJSON() {
    const {
      createdAt,
      updatedAt,
      plan,
      priceId,
      stripeSessionId,
      ...data
    } = this;
    sails.log.silly('Sanitizing', {
      createdAt,
      updatedAt,
      plan,
      priceId,
      stripeSessionId
    });
    return data;
  },

  beforeCreate(org, next) {
    if (!org.slug) org.slug = sails.helpers.dashCase(org.name);
    next();
  }

};

