// Importing main tables
const {User} = require("./Entities/Main/User");
const {Post} = require("./Entities/Main/Post");
const {Image} = require("./Entities/Main/Image");
const {Comment} = require("./Entities/Main/Comment");
const {Folder} = require("./Entities/Main/Folder");
const {Report} = require("./Entities/Main/Report");
const {Category} = require("./Entities/Main/Category");

// Importing connecting tables
const {UsersPost} = require("./Entities/Binders/UsersPost");
const {PostsImage} = require("./Entities/Binders/PostsImage");
const {UsersComment} = require("./Entities/Binders/UsersComment");
const {PostsComment} = require("./Entities/Binders/PostsComment");
const {UsersFolder} = require("./Entities/Binders/UsersFolder");
const {PostsReport} = require("./Entities/Binders/PostsReport");
const {PostsCategory} = require("./Entities/Binders/PostsCategory");
const {FoldersImage} = require("./Entities/Binders/FoldersImage");
const {UsersLike} = require("./Entities/Binders/UsersLike");
const {UsersImage} = require("./Entities/Binders/UsersImage");

function ConnectTables()
{
    // "Users" and "Posts" main tables connected with "UsersPosts" connecting table
    User.hasOne(UsersPost, {foreignKey: "userID"});
    Post.hasOne(UsersPost, {foreignKey: "postID"});

    UsersPost.belongsTo(User, {foreignKey: "userID"});
    UsersPost.belongsTo(Post, {foreignKey: "postID"});

    // "Posts" and "Images" main tables connected with "PostsImages" connecting table
    Post.hasOne(PostsImage, {foreignKey: "postID"});
    Image.hasOne(PostsImage, {foreignKey: "imageID"});

    PostsImage.belongsTo(Post, {foreignKey: "postID"});
    PostsImage.belongsTo(Image, {foreignKey: "imageID"});

    // "Users" and "Comments" main tables connected with "UsersComments" connecting table
    User.hasOne(UsersComment, {foreignKey: "userID"});
    Comment.hasOne(UsersComment, {foreignKey: "commentID"});

    UsersComment.belongsTo(User, {foreignKey: "userID"});
    UsersComment.belongsTo(Comment, {foreignKey: "commentID"});

    // "Posts" and "Comments" main tables connected with "PostsComments" connecting table
    Post.hasOne(PostsComment, {foreignKey: "postID"});
    Comment.hasOne(PostsComment, {foreignKey: "commentID"});

    PostsComment.belongsTo(Post, {foreignKey: "postID"});
    PostsComment.belongsTo(Comment, {foreignKey: "commentID"});

    // "Users" and "Folders" main tables connected with "UsersFolders" connecting table
    //User.hasOne(UsersFolder, {foreignKey: "userID"});
    //Folder.hasOne(UsersFolder, {foreignKey: "folderID"});

    //UsersFolder.belongsTo(User, {foreignKey: "userID"});
    //UsersFolder.belongsTo(Folder, {foreignKey: "folderID"});

    // "Reports" and "Posts" and "Users" main tables connected with "PostsReports" connecting table
    Report.hasOne(PostsReport, {foreignKey: "reportID"});
    Post.hasOne(PostsReport, {foreignKey: "postID"});
    User.hasOne(PostsReport, {foreignKey: "userID"});

    PostsReport.belongsTo(Report, {foreignKey: "reportID"});
    PostsReport.belongsTo(Post, {foreignKey: "postID"});
    PostsReport.belongsTo(User, {foreignKey: "userID"});

    // "Posts" and "Categories" main tables connected with "PostsCategories" connecting table
    Post.hasOne(PostsCategory, {foreignKey: "postID"});
    Category.hasOne(PostsCategory, {foreignKey: "categoryID"})

    PostsCategory.belongsTo(Post, {foreignKey: "postID"});
    PostsCategory.belongsTo(Category, {foreignKey: "categoryID"});

    // "Folders" and "Images" main tables connected with "FoldersImages" connecting table
    //Folder.hasOne(FoldersImage, {foreignKey: "folderID"});
    //Image.hasOne(FoldersImage, {foreignKey: "imageID"});

    //FoldersImage.belongsTo(Folder, {foreignKey: "folderID"});
    //FoldersImage.belongsTo(Image, {foreignKey: "imageID"});

    // "Posts" and "Users" main tables connected with "UsersLikes" connecting table
    Post.hasOne(UsersLike, {foreignKey: "postID"});
    User.hasOne(UsersLike, {foreignKey: "userID"});

    UsersLike.belongsTo(Folder, {foreignKey: "postID"});
    UsersLike.belongsTo(Image, {foreignKey: "userID"});

    // "Users" and "Images" main tables connected with "UsersImages" connecting table
    User.hasOne(UsersImage, {foreignKey: "userID"});
    Image.hasOne(UsersImage, {foreignKey: "imageID"});

    UsersImage.belongsTo(User, {foreignKey: "userID"});
    UsersImage.belongsTo(Image, {foreignKey: "imageID"});
}

async function SyncDatabase()
{
    // Set to "true" to delete all data from tables and reset connections
    let force = false;

    // Connecting main tables with connecting tables
    ConnectTables();

    if (force)
    {
        // Syncing main tables
        await User.sync({force: true});
        await Post.sync({force: true});
        await Image.sync({force: true})
        await Comment.sync({force: true});
        //await Folder.sync({force: true});
        await Report.sync({force: true});
        await Category.sync({force: true});

        // Syncing connecting tables
        await UsersPost.sync({force: true});
        await PostsImage.sync({force: true});
        await UsersComment.sync({force: true});
        await PostsComment.sync({force: true});
        //await UsersFolder.sync({force: true});
        await PostsReport.sync({force: true});
        await PostsCategory.sync({force: true});
        //await FoldersImage.sync({force: true});
        await UsersLike.sync({force: true});
        await UsersImage.sync({force: true});
    }
    else
    {
        // Syncing main tables
        await User.sync({alter: true});
        await Post.sync({alter: true});
        await Image.sync({alter: true})
        await Comment.sync({alter: true});
        //await Folder.sync({alter: true});
        await Report.sync({alter: true});
        await Category.sync({alter: true});

        // Syncing connecting tables
        await UsersPost.sync({alter: true});
        await PostsImage.sync({alter: true});
        await UsersComment.sync({alter: true});
        await PostsComment.sync({alter: true});
        //await UsersFolder.sync({alter: true});
        await PostsReport.sync({alter: true});
        await PostsCategory.sync({alter: true});
        //await FoldersImage.sync({alter: true});
        await UsersLike.sync({alter: true});
        await UsersImage.sync({alter: true});
    }
}

SyncDatabase().then(() => {
    console.log("All tables synced!");
});