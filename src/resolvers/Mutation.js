const Mutation = {
  async createCountry(parent, args, ctx, info) {
    console.log(args);
    const country = await ctx.db.mutation.createCountry(
      { data: { ...args } },
      info
    );
    return country;
  }
};
module.exports = Mutation;
