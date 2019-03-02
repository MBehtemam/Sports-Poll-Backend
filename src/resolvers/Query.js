const { forwardTo } = require('prisma-binding');
const Query = {
  countries: forwardTo("db"),
  //   async countries(parent, args, ctx, info) {
  //     const r = await ctx.db.query.countries();
  //     return r;
  //   },
  async groups(parent, args, ctx, info) {
    const r = await ctx.db.query.groups();
    return r;
  },
  sports:forwardTo('db')
};

module.exports = Query;
