const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hasPermission = require("../utils/hasPermission");
const mustLoggedIn = require("../utils/mustLoggedIn");
const Mutation = {
  async createCountry(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    hasPermission(user, ["ADMIN"]);
    const country = await ctx.db.mutation.createCountry(
      { data: { ...args } },
      info
    );
    return country;
  },
  async createGroup(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    hasPermission(user, ["ADMIN"]);
    const group = await ctx.db.mutation.createGroup(
      { data: { ...args } },
      info
    );
    return group;
  },
  async createSport(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    hasPermission(user, ["ADMIN"]);
    const sport = await ctx.db.mutation.createSport(
      { data: { ...args } },
      info
    );
    return sport;
  },
  async createTeam(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    hasPermission(user, ["ADMIN"]);
    const team = await ctx.db.mutation.createTeam({ data: { ...args } }, info);
    return team;
  },
  async createPollState(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    hasPermission(user, ["ADMIN"]);
    const pollState = await ctx.db.mutation.createPollState(
      { data: { ...args } },
      info
    );
    return pollState;
  },
  async createPoll(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    hasPermission(user, ["ADMIN"]);
    const { country, away, home, group, state, sport } = args;
    const poll = await ctx.db.mutation.createPoll(
      {
        data: {
          country: { connect: { id: country } },
          away: { connect: { id: away } },
          home: { connect: { id: home } },
          group: { connect: { id: group } },
          state: { connect: { id: state } },
          sport: { connect: { id: sport } }
        }
      },
      info
    );
    return poll;
  },
  async singup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      { data: { ...args, password, permissions: { set: ["USER"] } } },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return user;
  },
  async singin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return user;
  },
  singout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Successfully Logout" };
  },
  async pollPrediction(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    let predict = "";
    if (args.predict === "home") {
      predict = "HOME_WIN";
    } else if (predict === "away") {
      predict = "AWAY_WIN";
    } else {
      predict = "DRAW";
    }
    const poll = await ctx.db.mutation.updatePoll(
      {
        where: { id: args.pollId },
        data: {
          users: { connect: { id: ctx.request.user.id } },
          usersPrediction: {
            create: {
              predict,
              user: {
                connect: { id: ctx.request.user.id }
              }
            }
          }
        }
      },
      info
    );
    return poll;
  },
  async updatePermissions(parent, args, ctx, info) {
    mustLoggedIn(ctx);
    hasPermission(ctx.request.user, ["ADMIN"]);
    const { userId, permissions } = args;
    const user = ctx.db.mutation.updateUser(
      { where: { id: userId }, data: { permissions: { set: permissions } } },
      info
    );
    return user;
  }
};
module.exports = Mutation;
