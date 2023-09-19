import { DBType, UserType } from "../../db/db";
import express, { Response } from "express";
import { HTTP_STATUSES } from "../../utils";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../../types";
import { UserViewModel } from "./models/UserViewModel";
import { CreateUserModel } from "./models/CreateUserModel";
import { QueryUserModel } from "./models/QueryUserModel";

export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
  return {
    id: dbEntity.id,
    username: dbEntity.username,
  };
};

export const getUsersRouter = (db: DBType) => {
  const router = express.Router();

  router.get(
    "/",
    (req: RequestWithQuery<QueryUserModel>, res: Response<UserViewModel[]>) => {
      let foundEntities = db.users;

      if (req.query.username) {
        foundEntities = foundEntities.filter(
          (c) => c.username.indexOf(req.query.username) > -1,
        );
      }
      res.json(foundEntities.map(mapEntityToViewModel));
    },
  );

  router.get(
    `/:id`,
    (req: RequestWithParams<{ id: string }>, res: Response<UserViewModel>) => {
      let foundEntity = db.users.find((c) => c.id === +req.params.id);

      if (!foundEntity) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.json(mapEntityToViewModel(foundEntity));
    },
  );

  router.post(
    `/`,
    (req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel>) => {
      if (!req.body.username) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      const createdEntity: UserType = {
        id: +new Date(),
        username: req.body.username,
      };
      db.users.push(createdEntity);

      res
        .status(HTTP_STATUSES.CREATED_201)
        .json(mapEntityToViewModel(createdEntity));
    },
  );

  router.delete(`/:id`, (req: RequestWithParams<{ id: string }>, res) => {
    db.users = db.users.filter((c) => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  router.put(
    `/:id`,
    (
      req: RequestWithParamsAndBody<{ id: string }, { username: string }>,
      res,
    ) => {
      if (!req.body.username) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
      }
      const foundEntity = db.users.find((c) => c.id === +req.params.id);

      if (!foundEntity) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      foundEntity.username = req.body.username;

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );

  return router;
};
