const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const User = require('../../database/models/User.js');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
/**
 * @router     POST api/users
 * @desc      Register user
 * @access    public
 */

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] });
      }
      //get users' gravatar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });
      //ecnvrypt passwird usin bcrypt
      //applying a 10 round salt... because that is recommended
      const salt = await bcrypt.genSalt(10);
      //hashing the password with the salt
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //return jswonwebtoken{
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('SERVER ERROR');
    }
  }
);
module.exports = router;
