const {
  user,
  profile,
  followerFollowing,
  feed,
  like,
} = require("../../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Joi = require("joi");

exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "id", "userId"],
        },
      },
    });

    const dataUsers = users.map((data) => {
      return {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        image: process.env.FILE_PATH + data.profile.image,
        bio: data.profile.bio,
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        users: dataUsers,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.editUser = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(2).max(12).required(),
    fullName: Joi.string(),
    bio: Joi.string(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "failed",
      error: {
        message: error.details[0].message + " hello",
      },
    });
  }

  try {
    const { id } = req.params;

    console.log(req.body.image);

    await user.update(
      {
        fullName: req?.body?.fullName,
        username: req?.body?.username,
      },
      {
        where: {
          id,
        },
      }
    );

    await profile.update(
      {
        bio: req?.body?.bio,
        image: req?.file?.filename,
        // image: req?.file === undefined ? req?.file?.filename : req?.body?.image,
      },
      {
        where: {
          userId: id,
        },
      }
    );

    const updatedDataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "id", "userId"],
        },
      },
    });

    const dataUser = {
      id: updatedDataUser.id,
      fullName: updatedDataUser.fullName,
      email: updatedDataUser.email,
      username: updatedDataUser.username,
      image: updatedDataUser.profile.image,
      bio: updatedDataUser.profile.bio,
    };

    res.status(200).send({
      status: "success",
      data: {
        user: dataUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await user.destroy({
      where: {
        id,
      },
    });
    res.status(200).send({
      status: "success",
      data: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("the id is", id);

    const userProfile = await user.findOne({
      where: id,
      attributes: ["fullName", "username"],
      include: {
        model: profile,
        as: "profile",
        attributes: ["bio", "image"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        fullName: userProfile.fullName,
        username: userProfile.username,
        bio: userProfile.profile.bio,
        image: process.env.FILE_PATH + userProfile.profile.image,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error...",
    });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const followers = await followerFollowing.findAll({
      where: {
        followingUserId: id,
      },
      attributes: ["id", "userId"],
      include: {
        model: user,
        as: "follower",
        attributes: ["id", "fullName", "username"],
        include: {
          model: profile,
          as: "profile",
          attributes: ["userId", "image", "bio"],
        },
      },
    });

    const dataFollowers = followers.map((data) => {
      return {
        id: data.id,
        user: {
          id: data.follower.id,
          fullName: data.follower.fullName,
          username: data.follower.username,
          image: data.follower.profile.image,
        },
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        followers: dataFollowers,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const followings = await followerFollowing.findAll({
      where: {
        userId: id,
      },
      attributes: ["id", "userId"],
      include: {
        model: user,
        as: "following",
        attributes: ["id", "fullName", "username"],
        include: {
          model: profile,
          as: "profile",
          attributes: ["userId", "image", "bio"],
        },
      },
    });

    const dataFollowings = followings.map((data) => {
      return {
        id: data.id,
        user: {
          id: data.following.id,
          fullName: data.following.fullName,
          username: data.following.username,
          image: data.following.profile.image,
        },
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        followings: dataFollowings,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.checkFollowing = async (req, res) => {
  try {
    const { id: followingUserId } = req.params;
    const { id: userId } = req.user;

    const isUserFollowing = await followerFollowing.findOne({
      where: {
        [Op.and]: [{ userId }, { followingUserId }],
      },
      attributes: ["id", "userId", "followingUserId"],
    });

    console.log("aku adalah data dari database", isUserFollowing);

    res.status(200).send({
      status: "success",
      isUserFollowing,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const { id: followingUserId } = req.params;
    const { id: userId } = req.user;

    const data = await followerFollowing.destroy({
      where: {
        [Op.and]: [{ userId }, { followingUserId }],
      },
      attributes: ["id", "userId", "followingUserId"],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.follow = async (req, res) => {
  try {
    const { id: followingUserId } = req.params;
    const { id: userId } = req.user;

    const data = await followerFollowing.create({
      userId,
      followingUserId,
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getUserFeeds = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await feed.findAll({
      where: { userId: id },
      attributes: [[sequelize.fn("count", sequelize.col("id")), "sum"]],
    });
    res.status(200).send({
      status: "success",
      posts: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const isUserExist = await user.findOne({
      where: { username },
    });

    if (!isUserExist) {
      return res.status(404).send({
        status: "failed",
        message: `${username} is not found`,
      });
    }

    // get data from database
    const feeds = await feed.findAll({
      where: { userId: isUserExist.id },
      attributes: ["id", "image", "caption"],
      include: [
        {
          model: user,
          as: "user",
          attributes: ["id", "username", "fullName"],
          include: [
            {
              model: profile,
              as: "profile",
              attributes: ["image"],
            },
          ],
        },
        {
          model: like,
          attributes: ["userId"],
        },
      ],
      group: ["feed.createdAt"],
    });

    // shuffle feed
    const shuffle = async (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    };

    //manipulation data from database
    const data = await feeds.map((item) => {
      item.image = process.env.FILE_PATH + item.image;
      item.user.profile.image = item.user.profile.image
        ? process.env.FILE_PATH + item.user.profile.image
        : null;
      return item;
    });

    await shuffle(data);

    res.status(200).send({
      status: "success",
      data: {
        feed: data,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error...",
    });
  }
};

exports.getUserFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await feed.findOne({
      where: { id },
      attributes: ["id", "image", "caption"],
      include: [
        {
          model: user,
          as: "user",
          attributes: ["username"],
          include: [
            {
              model: profile,
              as: "profile",
              attributes: ["image"],
            },
          ],
        },
        {
          model: like,
          attributes: ["userId"],
        },
      ],
    });
    res.status(200).send({
      status: "success",
      data: {
        id: data.id,
        fileName: process.env.FILE_PATH + data.image,
        caption: data.caption,
        username: data.user.username,
        image: process.env.FILE_PATH + data.user.profile.image,
        likes: data.likes,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
    console.log(err);
  }
};

exports.getUserProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const userProfile = await user.findOne({
      where: { username },
      attributes: ["id", "fullName", "username"],
      include: {
        model: profile,
        as: "profile",
        attributes: ["bio", "image"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        id: userProfile.id,
        fullName: userProfile.fullName,
        username: userProfile.username,
        bio: userProfile.profile.bio,
        image: process.env.FILE_PATH + userProfile.profile.image,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error...",
    });
  }
};
