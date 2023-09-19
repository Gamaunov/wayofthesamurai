import express from "express";
import { db } from "./db/db";
import { getCoursesRouter } from "./features/courses/courses.router";
import { getTestsRouter } from "./routes/tests";
import { getUsersRouter } from "./features/users/users.router";

export const app = express();

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

export const RouterPath = {
  courses: "/courses",
  users: "/users",

  __test__: "/__test__",
};

app.use(RouterPath.courses, getCoursesRouter(db));
app.use(RouterPath.users, getUsersRouter(db));
app.use(RouterPath.__test__, getTestsRouter(db));
// app.use(RouterPath.users, getUsersRouter(db));
