import { CreateUserModel } from "./src/features/users/models/CreateUserModel";
import request from "supertest";
import { app, RouterPath } from "./src/app";
import { HTTP_STATUSES } from "./src/utils";

export const usersTestManager = {
  async createUser(data: CreateUserModel) {
    const response = await request(app)
      .post(RouterPath.users)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    return response;
  },
};
