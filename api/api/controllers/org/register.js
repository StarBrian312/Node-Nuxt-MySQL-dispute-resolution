

module.exports = {

  friendlyName: 'Create business',

  description: 'Create a user, org and orgUser.',

  inputs: {
    email: {type: 'string', required: true},
    phone: {type: 'string', required: true},
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    priceId: {type: 'string', required: true},

    company: {type: 'string'},
    website: {type: 'string'},
    abn: {
      type: 'number',
      required: true,
      custom: abn => sails.helpers.validate.abn(abn)
    }
  },

  exits: {
    badRequest: {responseType: 'badRequest'},
    ok: {responseType: 'ok'}
  },

  fn: async function(
    {
      email,
      phone,
      firstName,
      lastName,
      company,

      website,
      abn,
      priceId
    }) {
    return await sails
      .getDatastore()
      .transaction(async tx => {

        const userCheck = await User
          .findOne({email})
          .select(['id'])
          .usingConnection(tx);
        if (userCheck) throw {
          badRequest: {
            message: sails.__(`Sorry, this email is already taken.<br />`
                + `Please enter a new email, or sign-in using this one.`),
            code: 'E_UNIQUE'
          }
        };

        const orgCheck = await Org
          .findOne({abn})
          .select(['id'])
          .usingConnection(tx);
        if (orgCheck) throw {
          badRequest: {
            message: sails.__(`The business with this ABN `
            + `already exists in our system.`
            + ` Please contact us at info@guidedresolution.com` +
            ` if you are the owner of this business`)
          }
        };

        // api lookup org abn to get name
        const abnOrg = await sails.helpers.abr.abnLookup(abn);
        const {Abn} = abnOrg;
        if (!Abn) throw {
          badRequest: {
            message: sails.__(`ABN Not valid`)
          }
        };

        // Create user
        const user = await User.create({
          email,
          firstName,
          lastName,
          phone,
          company
        })
        .usingConnection(tx)
        .fetch();

        // Create session
        const stripe = await sails.helpers.stripe();

        const stripeSession = await stripe.checkout.sessions.create({
          'success_url': sails.config.custom.clientURL +
            '/subscribe/payment-processing',
          'cancel_url': `${sails.config.custom.clientURL}/subscribe/cancel`,
          'payment_method_types': ['card'],
          'line_items': [
            {price: priceId, quantity: 1}
          ],
          mode: 'subscription'
        });

        // Create org
        const org = await Org
          .create({
            name: company,
            abn,
            website,
            phone,
            slug: sails.helpers.dashCase(company),
            priceId,
            stripeSessionId: stripeSession.id
          })
          .usingConnection(tx)
          .fetch();

        // Create org user
        await OrgUser
          .create({
            user: user.id,
            org: org.id,
            role: 1
          })
          .usingConnection(tx);

        const token = await User
          .setPasswordResetToken(user.id, tx);

        await sails.helpers.email.send(
          'registration',
          {
            clientURL: sails.config.custom.clientURL,
            email: user.email,
            token
          },
          {
            to: email,
            subject: sails.__('Welcome')
          }
        );

        return {
          stripeSessionId: stripeSession.id
        };
      });
  }
};
