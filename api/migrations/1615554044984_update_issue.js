const async = require('async');

module.exports = {
  'up': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`issue\`
      ADD COLUMN \`submittedAt\` DOUBLE DEFAULT NULL AFTER \`submittedAt\`
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  }),
  'down': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`issue\`
      DROP COLUMN \`submittedAt\`
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  })
};
