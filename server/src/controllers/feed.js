const { Op } = require("sequelize");
const sequelize = require("sequelize");

const {
  feed,
  user,
  profile,
  followerFollowing,
  like,
  comment,
} = require("../../models");

exports.addFeed = async (req, res) => {
  try {
    await feed.create({
      userId: req.user.id,
      image: req.file.filename,
      caption: req.body.caption,
    });

    const dataFeed = await feed.findOne({
      where: {
        userId: req.user.id,
      },
      attributes: ["id", ["image", "fileName"], "caption"],
      include: {
        model: user,
        as: "user",
        attributes: ["id", "fullName", "username"],
        include: {
          model: profile,
          as: "profile",
          attributes: ["image"],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      status: "success",
      data: {
        feed: dataFeed,
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

exports.getFeedByFollow = async (req, res) => {
  try {
    const feeds = await followerFollowing.findAll({
      where: {
        userId: req.params.id,
      },
      attributes: [],
      include: {
        model: user,
        as: "following",
        attributes: ["id", "username", "fullName"],
        include: [
          {
            model: profile,
            as: "profile",
            attributes: ["image"],
          },
          {
            model: feed,
            as: "feed",
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
          },
        ],
      },
      group: ["following.feed.likes.userId", "following.feed.id"],
    });

    // manipulation data from database
    let data = [];
    for await (const item of feeds) {
      data.push(...item.following.feed);
    }

    for await (const item of data) {
      item.image = process.env.FILE_PATH + item.image;
      item.user.profile.image = item.user.profile.image
        ? process.env.FILE_PATH + item.user.profile.image
        : null;
    }

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

exports.getFeeds = async (req, res) => {
  try {
    // get data from database
    const feeds = await feed.findAll({
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

exports.like = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.headers);
    console.log(req.body);
    console.log("feed id is ", id);

    const isFeedExist = await feed.findOne({
      where: { id: id },
    });

    const isUserLiked = await like.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { feedId: id }],
      },
    });

    // check if feed exist
    if (!isFeedExist) {
      return res.status(404).send({
        status: "failed",
        message: `Feed ${id} not found!`,
      });
    }

    // check if user already like the feed
    if (isUserLiked) {
      return res.status(404).send({
        status: "failed",
        message: `You have liked this feed`,
      });
    }

    // add like to feed
    const likeFeed = await like.create({
      userId: req.user.id,
      feedId: req.body.id,
    });

    res.status(200).send({
      status: "success",
      data: {
        feed: {
          id: likeFeed.feedId,
        },
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

exports.unLike = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("the body", req.body);
    console.log("feed id is ", id);

    // add like to feed
    await like.destroy({
      where: {
        [Op.and]: [{ userId: req.user.id }, { feedId: id }],
      },
    });

    res.status(200).send({
      status: "success",
      message: `Feed ${id} is unliked`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    // get comments from feed
    const comments = await comment.findAll({
      where: { feedId: id },
      attributes: ["id", "comment"],
      include: {
        model: user,
        as: "user",
        attributes: ["id", "fullName", "username"],
        include: {
          model: profile,
          as: "profile",
          attributes: ["image"],
        },
      },
    });

    // manipulation data
    const data = comments.map((dataComment) => {
      return {
        id: dataComment.id,
        comment: dataComment.comment,
        user: {
          id: dataComment.user.id,
          fullName: dataComment.user.fullName,
          username: dataComment.user.username,
          image: process.env.FILE_PATH + dataComment.user.profile.image,
        },
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        comments: data,
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

exports.addComment = async (req, res) => {
  try {
    const isFeedExist = await feed.findOne({
      where: { id: req.body.id },
    });

    // do check if feed exist
    if (!isFeedExist) {
      return res.status(404).send({
        status: "failed",
        message: `Feed ${id} not found!`,
      });
    }

    // store comment to database
    const dataComment = await comment.create({
      userId: req.user.id,
      feedId: req.body.id,
      comment: req.body.comment,
    });

    res.status(200).send({
      status: "success",
      data: {
        comment: {
          id: dataComment.id,
        },
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
