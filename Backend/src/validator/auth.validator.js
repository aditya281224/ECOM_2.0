import {body, validationResult} from 'express-validator';


function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
export const validateRegisterUser = [
  body('fullname').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address') ,
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('contact').notEmpty().withMessage('Contact is required').isLength({ min: 10, max: 10 }).withMessage('Contact must be 10 digits long').matches(/^[0-9]+$/, 'i').withMessage('Contact must contain only digits'),  

  body("isSeller").isBoolean().withMessage("isSeller must be a boolean value"),

  validateRequest
];
