// Importing models
const db = require("./database");
const { User } = require("./Models/User");
const { Post } = require("./Models/Post");
const { Comment } = require("./Models/Comment");
const { Category } = require("./Models/Category");
const { PostLike } = require("./Models/PostLike");
const { CommentLike } = require("./Models/CommentLike");
const { UserFollow } = require("./Models/UserFollow");
const { Reply } = require("./Models/Reply");

function ConnectModels()
{
    User.hasMany(UserFollow, {foreignKey: "followerID"});
    User.hasMany(UserFollow, {foreignKey: "followedID"});

    User.hasMany(Post, {foreignKey: "userID"});
    Category.hasOne(Post, {foreignKey: "categoryID"})

    User.hasMany(PostLike, {foreignKey: "userID"});
    Post.hasMany(PostLike, {foreignKey: "postID"});
    
    User.hasMany(Comment, {foreignKey: "userID"});
    Post.hasMany(Comment, {foreignKey: "postID"});

    User.hasMany(CommentLike, {foreignKey: "userID"});
    Comment.hasMany(CommentLike, {foreignKey: "commentID"});

    Comment.hasMany(Reply, {foreignKey: "commentID"});
    Comment.hasMany(Reply, {foreignKey: "replyID"});
}

async function SyncDatabase()
{
    ConnectModels();

    // Syncing all tables
    try
    {
        await db.sync({ alter: false }).then(() => {
            console.log("All tables are connected and synced!");
        });
    }
    catch (error)
    {
        await db.sync({ force: true }).then(() => {
            console.log("Error during syncing the database! Database sync forced!");
        });
    }
}

SyncDatabase();