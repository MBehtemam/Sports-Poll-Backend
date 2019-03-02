const Mutation = {
  async createCountry(parent, args, ctx, info) {
    const country = await ctx.db.mutation.createCountry(
      { data: { ...args } },
      info
    );
    return country;
  },
  async createGroup(parent, args, ctx, info) {
    const group = await ctx.db.mutation.createGroup(
      { data: { ...args } },
      info
    );
    return group;
  }
};
module.exports = Mutation;
