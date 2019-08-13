const router = require('express').Router();

/**
 * @router     POST api/users
 * @desc      Register user
 * @access    public
 */

router.post('/', (req, res) => {
  console.log(req.body);
  res.send('user Router');
});
module.exports = router;
