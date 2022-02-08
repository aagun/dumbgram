"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "userId",
        },
      });

      user.hasMany(models.followerFollowing, {
        as: "follower",
        foreignKey: {
          name: "userId",
        },
      });

      user.hasMany(models.followerFollowing, {
        as: "following",
        foreignKey: {
          name: "followingUserId",
        },
      });

      user.hasMany(models.feed, {
        as: "feed",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  user.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
