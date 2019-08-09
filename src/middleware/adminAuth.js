import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";

const { SECRET_KEY, DASHBOARD_PASSWORD } = process.env;

passport.use(
  "admin-rule",
  new BearerStrategy(async (token, done) => {
    let decoded;
    try {
      decoded = await jwt.verify(token, SECRET_KEY);
    }
 catch (err) {
      return done(null, false);
    }

    try {
      if (decoded.key !== DASHBOARD_PASSWORD) {
        throw new Error("Unauthorized auth attempt");
      }
      return done(null, true);
    }
 catch (err) {
      return done(err);
    }
  })
);

const adminAuthMiddleware = passport.authenticate("admin-rule", {
  session: false
});

export default adminAuthMiddleware;
