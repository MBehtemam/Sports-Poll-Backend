const { forwardTo } = require("prisma-binding");
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
  sports: forwardTo("db"),
  teams: forwardTo("db"),
  pollStates: forwardTo("db"),
  polls: forwardTo("db"),
  user: (parent, args, ctx, info) => {
    if (!ctx.request.userId) {
      return null;
    } else {
      return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
    }
  },
  randomPolls: async (parent, args, ctx, info) => {
    const sports = await ctx.db.query.sports();
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const polls = await ctx.db.query.polls(
      {
        where: {
          users_none: {
            id_not_in: ["cjss49n7w5qqt0b873yw6vv5f"]
          },
          state: {
            name: "STARTED"
          },
          sport: {
            id: sport.id
          }
        }
      },
      info
    );
    return polls;
  }
};

module.exports = Query;
