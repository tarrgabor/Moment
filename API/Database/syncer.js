// Importing main tables
const db = require("./database");
const {User} = require("./Entities/Main/User");
const {Post} = require("./Entities/Main/Post");
const {Image} = require("./Entities/Main/Image");
const {Comment} = require("./Entities/Main/Comment");
const {Report} = require("./Entities/Main/Report");
const {Category} = require("./Entities/Main/Category");

// Importing connecting tables
const {UsersPost} = require("./Entities/Binders/UsersPost");
const {PostsImage} = require("./Entities/Binders/PostsImage");
const {UsersComment} = require("./Entities/Binders/UsersComment");
const {PostsComment} = require("./Entities/Binders/PostsComment");
const {PostsReport} = require("./Entities/Binders/PostsReport");
const {PostsCategory} = require("./Entities/Binders/PostsCategory");
const {PostLike} = require("./Entities/Binders/PostLike");
const {UsersImage} = require("./Entities/Binders/UsersImage");

function ConnectTables()
{
    // "Users" and "Posts" main tables connected with "UsersPosts" connecting table
    User.hasMany(UsersPost, {foreignKey: "userID"});
    Post.hasOne(UsersPost, {foreignKey: "postID"});

    UsersPost.belongsTo(User, {foreignKey: "userID", onDelete: "cascade"});
    UsersPost.belongsTo(Post, {foreignKey: "postID", onDelete: "cascade"});

    // "Posts" and "Images" main tables connected with "PostsImages" connecting table
    Post.hasOne(PostsImage, {foreignKey: "postID"});
    Image.hasOne(PostsImage, {foreignKey: "imageID"});

    PostsImage.belongsTo(Post, {foreignKey: "postID"});
    PostsImage.belongsTo(Image, {foreignKey: "imageID"});

    // "Users" and "Comments" main tables connected with "UsersComments" connecting table
    User.hasMany(UsersComment, {foreignKey: "userID"});
    Comment.hasOne(UsersComment, {foreignKey: "commentID"});

    UsersComment.belongsTo(User, {foreignKey: "userID"});
    UsersComment.belongsTo(Comment, {foreignKey: "commentID"});

    // "Posts" and "Comments" main tables connected with "PostsComments" connecting table
    Post.hasMany(PostsComment, {foreignKey: "postID"});
    Comment.hasOne(PostsComment, {foreignKey: "commentID"});

    PostsComment.belongsTo(Post, {foreignKey: "postID"});
    PostsComment.belongsTo(Comment, {foreignKey: "commentID"});

    // "Reports" and "Posts" and "Users" main tables connected with "PostsReports" connecting table
    Report.hasOne(PostsReport, {foreignKey: "reportID"});
    Post.hasMany(PostsReport, {foreignKey: "postID"});
    User.hasMany(PostsReport, {foreignKey: "userID"});

    PostsReport.belongsTo(Report, {foreignKey: "reportID"});
    PostsReport.belongsTo(Post, {foreignKey: "postID"});
    PostsReport.belongsTo(User, {foreignKey: "userID"});

    // "Posts" and "Categories" main tables connected with "PostsCategories" connecting table
    Post.hasOne(PostsCategory, {foreignKey: "postID"});
    Category.hasMany(PostsCategory, {foreignKey: "categoryID"})

    PostsCategory.belongsTo(Post, {foreignKey: "postID"});
    PostsCategory.belongsTo(Category, {foreignKey: "categoryID"});

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