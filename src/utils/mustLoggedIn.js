const mustLoggedIn = ctx => {
  if (!ctx.request.user) {
    throw new Error("You Must Logged in");
  }
};
module.exports = mustLoggedIn;
