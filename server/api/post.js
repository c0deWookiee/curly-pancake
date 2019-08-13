const router = require('express').Router();

/**
 * @router     GET api/posts
 * @desc      Test Router
 * @access    public
 */

router.get('/', (req, res) => res.send('post Router'));
module.exports = router;
