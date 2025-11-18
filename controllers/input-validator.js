import { validationResult } from "express-validator";

function checkValidations(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.locals.errors = errors.array().map((e) => e.msg);
  }
  next();
}

export { checkValidations };
