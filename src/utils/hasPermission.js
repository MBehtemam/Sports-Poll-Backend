/**
 * this method accept user and permissions that need for doing some action and if user
 * has not a required permissions then trhow and error
 * @param {Object} user user that we want to check
 * @param {Array} permissionsNeeded actual needed permissions
 */
const hasPermission = (user, permissionsNeeded) => {
  const matched = user.permissions.filter(p => permissionsNeeded.includes(p));
  if (!matched.length) {
    throw new Error(`you dont have permissions to do this`);
  }
};
module.exports = hasPermission;
