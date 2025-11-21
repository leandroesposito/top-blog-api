import { validationResult } from "express-validator";

function checkValidations(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(409).json({ errors: errors.array().map((e) => e.msg) });
  }
  next();
}

export { checkValidations };
