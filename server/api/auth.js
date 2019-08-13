const router = require('express').Router();

/**
 * @router     GET api/auth
 * @desc      Test Router
 * @access    public
 */

router.get('/', (req, res) => res.send(' Router'));
module.exports = router;
