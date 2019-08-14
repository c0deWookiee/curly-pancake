const router = require('express').Router();
const auth = require('../../middleware/authentication.js');
const User = require('../../database/models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

/**
 * @router     GET api/auth
 * @desc      Test Router
 * @access    public
 */

router.get('/', auth, async (req, res) => {
  //query database for user id
  const response = await User.findById(req.user.id).select('-password');
  //make sure data is not included in data being sent back
  //send back data
  res.status(200).send(response);
});

/**
 * @router     POST api/auth
 * @desc      user login
 * @access    public
 */

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be entered').exists()
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email and/or password is incorrect' }] });
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
