const router = require('express').Router();
const Profile = require('../../database/models/Profile.js');
const auth = require('../../middleware/authentication.js');
const User = require('../../database/models/User.js');

const { check, validationResult } = require('express-validator/check');

/**
 * @router     GET api/profile
 * @desc      get current user
 * @access    public
 */

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar']
        );

        if (!profile) {
            return res.status(400).json({ msg: 'No Profile' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

/**
 * @router     GET api/profile
 * @desc      create or update a user profile
 * @access    public
 */

router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status can not be left blank!')
                .not()
                .isEmpty(),
            check('skills', 'Skills can not be left blank!')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //buil profile object (this is ugly and verbose i plan to make a functions page.)

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(item => item.trim());
        }
        // console.log(profileFields.skills);

        //build social object

        profileFields.social = {};

        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        console.log(profileFields.social);
        res.send('hello');
    }
);
module.exports = router;
