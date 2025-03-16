// Importing main tables
const db = require("./database");
const {User} = require("./Entities/Main/User");
const {Post} = require("./Entities/Main/Post");
const {Image} = require("./Entities/Main/Image");
const {Comment} = require("./Entities/Main/Comment");
const {Report} = require("./Entities/Main/Report");
const {Category} = require("./Entities/Main/Category");

// Importing connecting tables
const {UserPost} = require("./Entities/Binders/UserPost");
const {PostImage} = require("./Entities/Binders/PostImage");
const {UserComment} = require("./Entities/Binders/UserComment");
const {PostComment} = require("./Entities/Binders/PostComment");
const {PostReport} = require("./Entities/Binders/PostReport");
const {PostCategory} = require("./Entities/Binders/PostCategory");
const {PostLike} = require("./Entities/Binders/PostLike");
const {UsersImage} = require("./Entities/Binders/UsersImage");

function ConnectTables()
{
    // "Users" and "Posts" main tables connected with "UsersPosts" connecting table
    User.hasMany(UserPost, {foreignKey: "userID"});
    Post.hasOne(UserPost, {foreignKey: "postID"});

    UserPost.belongsTo(User, {foreignKey: "userID"});
    UserPost.belongsTo(Post, {foreignKey: "postID"});

    // "Posts" and "Images" main tables connected with "PostsImages" connecting table
    Post.hasOne(PostImage, {foreignKey: "postID"});
    Image.hasOne(PostImage, {foreignKey: "imageID"});

    PostImage.belongsTo(Post, {foreignKey: "postID"});
    PostImage.belongsTo(Image, {foreignKey: "imageID"});

    // "Users" and "Comments" main tables connected with "UsersComments" connecting table
    User.hasMany(UserComment, {foreignKey: "userID"});
    Comment.hasOne(UserComment, {foreignKey: "commentID"});

    UserComment.belongsTo(User, {foreignKey: "userID"});
    UserComment.belongsTo(Comment, {foreignKey: "commentID"});

    // "Posts" and "Comments" main tables connected with "PostsComments" connecting table
    Post.hasMany(PostComment, {foreignKey: "postID"});
    Comment.hasOne(PostComment, {foreignKey: "commentID"});

    PostComment.belongsTo(Post, {foreignKey: "postID"});
    PostComment.belongsTo(Comment, {foreignKey: "commentID"});

    // "Reports" and "Posts" and "Users" main tables connected with "PostsReports" connecting table
    Report.hasOne(PostReport, {foreignKey: "reportID"});
    Post.hasMany(PostReport, {foreignKey: "postID"});
    User.hasMany(PostReport, {foreignKey: "userID"});

    PostReport.belongsTo(Report, {foreignKey: "reportID"});
    PostReport.belongsTo(Post, {foreignKey: "postID"});
    PostReport.belongsTo(User, {foreignKey: "userID"});

    // "Posts" and "Categories" main tables connected with "PostsCategories" connecting table
    Post.hasOne(PostCategory, {foreignKey: "postID"});
    Category.hasMany(PostCategory, {foreignKey: "categoryID"})

    PostCategory.belongsTo(Post, {foreignKey: "postID"});
    PostCategory.belongsTo(Category, {foreignKey: "categoryID"});

    // "Posts" and "Users" main tables connected with "PostLikes" connecting table
    Post.hasMany(PostLike, {foreignKey: "postID"});
    User.hasMany(PostLike, {foreignKey: "userID"});

    PostLike.belongsTo(Post, {foreignKey: "postID"});
    PostLike.belongsTo(User, {foreignKey: "userID"});

    // "Users" and "Images" main tables connected with "UsersImages" connecting table
    User.hasMany(UsersImage, {foreignKey: "userID"});
    Image.hasOne(UsersImage, {foreignKey: "imageID"});

    UsersImage.belongsTo(User, {foreignKey: "userID"});
    UsersImage.belongsTo(Image, {foreignKey: "imageID"});
}

async function SyncDatabase()
{
    // Connecting main tables with connecting tables
    ConnectTables();

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