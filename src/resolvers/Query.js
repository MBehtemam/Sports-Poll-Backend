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
  },
  async sportsPollCount(parent, args, ctx, info) {
    const polls = await ctx.db.query.polls(
      {
        where: {
          users_some: {
            id_in: [ctx.request.user.id]
          }
        }
      },
      `{id sport { id name }}`
    );
    const result = {
      title: "Most Sports User Like",
      results: []
    };
    const sports = {};
    result.results = polls.map(p => p.sport.name).forEach(s => {
      if (sports[s]) {
        sports[s]++;
      } else {
        sports[s] = 1;
      }
    });
    result.results = Object.keys(sports).map(key => ({
      label: key,
      count: sports[key]
    }));
    return result;
  },
  async userCorrectPolls(parent, args, ctx, info) {
    const correctHomeWin = await ctx.db.query.polls({
      where: {
        result: "HOME_WIN",
        users_every: {
          id_in: [ctx.request.user.id]
        },
        usersPrediction_every: {
          user: {
            id_in: [ctx.request.user.id]
          },
          predict: "HOME_WIN"
        }
      }
    });
    const correctAwayWin = await ctx.db.query.polls({
      where: {
        result: "AWAY_WIN",
        users_every: {
          id_in: [ctx.request.user.id]
        },
        usersPrediction_every: {
          user: {
            id_in: [ctx.request.user.id]
          },
          predict: "AWAY_WIN"
        }
      }
    });
    const correctDraw = await await ctx.db.query.polls({
      where: {
        result: "DRAW",
        users_every: {
          id_in: [ctx.request.user.id]
        },
        usersPrediction_every: {
          user: {
            id_in: [ctx.request.user.id]
          },
          predict: "DRAW"
        }
      }
    });
    const result = {
      title: "Correct Polls",
      results: [
        { label: "Home Win", count: correctHomeWin.length },
        { label: "Away Win", count: correctAwayWin.length },
        { label: "Draw", count: correctDraw.length }
      ]
    };
    return result;
  }
};

module.exports = Query;
