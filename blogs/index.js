const express = require("express");
require("express-async-errors");

const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const authorsRouter = require("./controllers/authors");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const readingListsRouter = require("./controllers/readingLists");
const errorHandler = require("./controllers/errorHandler");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/readinglists", readingListsRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
