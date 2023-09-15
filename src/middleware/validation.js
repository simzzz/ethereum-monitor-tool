const Joi = require('joi');

const name = Joi.string()
  .max(50)
  .regex(/^[a-zA-Z0-9]*$/)
  .required();

const rules = Joi.object({
  minValue: Joi.string().optional(),
  maxValue: Joi.string().optional(),
  fromAddress: Joi.string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  toAddress: Joi.string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  minGas: Joi.number().integer().min(0).optional(),
  maxGas: Joi.number().integer().min(0).optional()
})
  .min(1)
  .required();

const blockDelay = Joi.number().integer().min(0).optional();

const postValidation = Joi.object({
  name,
  rules,
  blockDelay
}).unknown(false);

const putValidation = Joi.object({
  rules,
  blockDelay
}).unknown(false);

const deleteValidation = Joi.object({}).unknown(false);

const validatePost = (req, res, next) => {
  const { error } = postValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

const validatePut = (req, res, next) => {
  const { error } = putValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

const validateDelete = (req, res, next) => {
  const { error } = deleteValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

module.exports = {
  validatePost,
  validatePut,
  validateDelete
};
