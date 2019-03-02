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
  },
  async createSport(parent, args, ctx, info) {
    const sport = await ctx.db.mutation.createSport(
      { data: { ...args } },
      info
    );
    return sport;
  }
};
module.exports = Mutation;
