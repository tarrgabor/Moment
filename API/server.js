require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/users", require("./Routes/UserRoutes"));
app.use("/posts", require("./Routes/PostRoutes"));
app.use("/category", require("./Routes/CategoryRoutes"));

app.listen(process.env.PORT, () => {
    require("./Database/syncer");
    console.log(`Server is listening on port: ${process.env.PORT}`);
});