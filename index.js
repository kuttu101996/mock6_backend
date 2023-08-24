const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
const blogRouter = require("./routes/blog.route");
require("dotenv").config()

const app = express();
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get("/", (req, res)=> {
    res.send("Hello Server is running fine")
})

app.use("/user", userRouter)
app.use("/api/blogs", blogRouter)

app.listen(process.env.port, async()=> {
    try {
        await connection;
        console.log('DB is connected');
        console.log(`Server running at ${process.env.port}`);
    } catch (error) {
        console.log(error);
    }
})