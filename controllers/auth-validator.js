import passport from "passport";

function authenticate(requireAuthor = false) {
  return function (req, res, next) {
    return passport.authenticate(
      "jwt",
      { session: false },
      (error, user, info) => {
        if (error) {
          console.error("Auth error:", error);
          next(error);
        }

        if (!user) {
          return res.status(401).json({
            errors: ["Not authorized, invalid token"],
          });
        }

        if (requireAuthor && !user.isAuthor) {
          return res.status(403).json({
            errors: [
              "Not authorized, you must be an author to access this resource",
            ],
          });
        }

        req.user = user;

        next();
      }
    )(req, res, next);
  };
}

export default authenticate;
