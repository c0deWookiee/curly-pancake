const router = require('express').Router();

/**
 * @router     GET api/users
 * @desc      Test Router
 * @access    public
 */

router.get('/', (req, res) => res.send('user Router'));

module.exports = router;
