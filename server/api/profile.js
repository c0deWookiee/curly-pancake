const router = require('express').Router();

/**
 * @router     GET api/profile
 * @desc      Test Router
 * @access    public
 */

router.get('/', (req, res) => {
  res.send('profile Router');
});
module.exports = router;
