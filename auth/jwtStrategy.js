import passportJwt from "passport-jwt";
import "dotenv/config";
import * as userDB from "../db/user.js";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTTOKEN;

const strategy = new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    const user = await userDB.getUserById(jwt_payload.id);

    if (!user) {
      done(null, false);
    }

    done(null, user);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

export default strategy;
