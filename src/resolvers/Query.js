const { forwardTo } = require("prisma-binding");
const hasPermission = require("../utils/hasPermission");
const mustLoggedIn = require("../utils/mustLoggedIn");

const Query = {
  countries: forwardTo("db"),
  async groups(parent, args, ctx, info) {
    const r = await ctx.db.query.groups();
    return r;
  },
  sports: forwardTo("db"),
  teams: forwardTo("db"),
  pollStates: forwardTo("db"),
  polls: forwardTo("db"),
  poll: (parent, args, ctx, info) => {
    return ctx.db.query.poll({ where: { id: args.id } }, info);
  },
  user: (parent, args, ctx, info) => {
    if (!ctx.request.userId) {
      return null;
    } else {
      return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
    }
  },
  users: async (parent, args, ctx, info) => {
    return await ctx.db.query.users({}, info);
  },
  randomPolls: async (parent, args, ctx, info) => {
    const sportsQuery = await ctx.db.query.polls(
      {
        where: {
          users_none: {
            id_in: [ctx.request.user.id]
          },
          state: { name: "STARTED" }
        }
      },
      `{id sport{id}}`
    );
    const sports = sportsQuery
      .map(item => item.sport.id)
      .filter((id, index, arr) => arr.indexOf(id) == index);
    // const sports = await ctx.db.query.sports(info);
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const polls = await ctx.db.query.polls(
      {
        where: {
          users_none: {
            id_in: [ctx.request.user.id]
          },
          state: {
            name_in: ["STARTED"]
          },
          sport: {
            id: sport
          }
        }
      },
      info
    );
    return polls;
  }
};

module.exports = Query;
