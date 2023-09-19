import { CoursesType, DBType } from "../db/db";
import express, { Response } from "express";
import { CourseViewModel } from "../models/CourseViewModel";
import { HTTP_STATUSES } from "../utils";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { QueryCoursesModel } from "../models/QueryCoursesModel";
import { CreateCourseModel } from "../models/CreateCourseModel";

// export const getCourseViewModel = (dbCourse: CoursesType): CourseViewModel => {
//   return {
//     id:dbCourse.id,
//     title:dbCourse.title,
//   }
// }

// export const getCoursesRouter  = (db:DBType)=>{

const getCourseViewModel = (dbCourse: CoursesType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getUsersRouter = (db: DBType) => {
  const router = express.Router();

  router.get(
    "/",
    (
      req: RequestWithQuery<QueryCoursesModel>,
      res: Response<CourseViewModel[]>,
    ) => {
      let foundCourses = db.courses;

      if (req.query.title) {
        foundCourses = foundCourses.filter(
          (c) => c.title.indexOf(req.query.title) > -1,
        );
      }
      res.json(foundCourses.map(getCourseViewModel));
    },
  );

  router.get(
    `/:id`,
    (
      req: RequestWithParams<{ id: string }>,
      res: Response<CourseViewModel>,
    ) => {
      let foundCourse = db.courses.find((c) => c.id === +req.params.id);

      if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.json(getCourseViewModel(foundCourse));
    },
  );

  router.post(
    `/`,
    (
      req: RequestWithBody<CreateCourseModel>,
      res: Response<CourseViewModel>,
    ) => {
      if (!req.body.username) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      const createdCourse: CoursesType = {
        id: +new Date(),
        title: req.body.username,
        studentsCount: 0,
      };
      db.courses.push(createdCourse);

      res
        .status(HTTP_STATUSES.CREATED_201)
        .json(getCourseViewModel(createdCourse));
    },
  );

  router.delete(`/:id`, (req: RequestWithParams<{ id: string }>, res) => {
    db.courses = db.courses.filter((c) => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  router.put(
    `/:id`,
    (req: RequestWithParamsAndBody<{ id: string }, { title: string }>, res) => {
      if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      const foundCourse = db.courses.find((c) => c.id === +req.params.id);

      if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      foundCourse.title = req.body.title;

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );

  return router;
};
