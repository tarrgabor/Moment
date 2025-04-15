require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/users", require("./Routes/UserRoutes"));
app.use("/posts", require("./Routes/PostRoutes"));
app.use("/categories", require("./Routes/CategoryRoutes"));
app.use("/comments", require("./Routes/CommentRoutes"));
app.use("/search", require("./Routes/SearchRoutes"));

app.listen(process.env.PORT, () => {
    require("./Database/syncer");
    console.log(`Server is listening on port: ${process.env.PORT}`);
});