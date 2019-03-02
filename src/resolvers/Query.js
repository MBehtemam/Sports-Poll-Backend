const Query = {
  async countries(parent, args, ctx, info) {
    const r = await ctx.db.query.countries();
    return r;
  },
  async groups(parent, args, ctx, info) {
    const r = await ctx.db.query.groups();
    return r;
  }
};

module.exports = Query;
