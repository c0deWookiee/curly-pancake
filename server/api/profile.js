const router = require("express").Router();
const Profile = require("../../database/models/Profile.js");
const request = require("request");
const config = require("config");
const auth = require("../../middleware/authentication.js");
const User = require("../../database/models/User.js");

const { check, validationResult } = require("express-validator");

/**
 * @router     GET api/profile/me
 * @desc      get current user
 * @access    public
 */

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "No Profile" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

/**
 * @router     GET api/profile
 * @desc      create or update a user profile
 * @access    public
 */

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status can not be left blank!")
        .not()
        .isEmpty(),
      check("skills", "Skills can not be left blank!")
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
      profileFields.skills = skills.split(",").map(item => item.trim());
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

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //here if the profile exists, we will use find one and  update the database with new fields, and passing in the true option to new, making sure that the dbServer returns the updated copy and not the old one
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

/**
 * @router     GET api/profile
 * @desc      get all profiles
 * @access    public
 */
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find(/**all */).populate("user", [
      //you can choose what props you'd like to populate
      "name",
      "avatar"
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("server Error");
  }
});

/**
 * @router     GET api/profile/user/:user_id
 * @desc      get profile by user id
 * @access    public
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).json({ msg: "profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message, "tryCatchline145");
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }
    res.status(500).send("server Error");
  }
});

/**
 * @router     DELETE api/profile/user/:user_id
 * @desc      delete profile by user id
 * @access    private
 */

router.delete("/", auth, async (req, res) => {
  try {
    //@todo remove users posts
    //deletes profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //removes user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "user erased" });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("server Error");
  }
});

/**
 * @router    PUT api/profile/experience
 * @desc      add profile by user id
 * @access    private
 */

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
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
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @router    DELETE api/profile/experience
 * @desc      delete profile experience
 * @access    private
 */

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @router    PUT api/profile/education
 * @desc      add profile education
 * @access    private
 */

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
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
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
