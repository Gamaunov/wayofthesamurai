import request from "supertest";
import { app, RouterPath } from "../../src/app";
import { HTTP_STATUSES } from "../../src/utils";
import { CreateUserModel } from "../../src/features/users/models/CreateUserModel";
import { UpdateUserModel } from "../../src/features/users/models/UpdateUserModel";

const getRequest = () => {
  return request(app);
};

describe("users", () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPath.__test__}/data`);
  });

  it("should return 200 and empty array", async () => {
    await getRequest().get(RouterPath.users).expect(HTTP_STATUSES.OK_200, []);
  });

  it(`should return 404 for not existing entity`, async () => {
    await request(app)
      .get(`${RouterPath.users}/1`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it(`shouldn't create entity with incorrect input data`, async () => {
    const data: CreateUserModel = { username: "" };

    await request(app)
      .post(RouterPath.users)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app).get(RouterPath.users).expect(HTTP_STATUSES.OK_200);
  });

  let createdEntity1: any = null;
  it(`should create entity with correct input data`, async () => {
    const data: CreateUserModel = { username: "new username" };

    const createResponse = await request(app)
      .post(RouterPath.users)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    createdEntity1 = createResponse.body.expect(createdEntity1).toEqual({
      id: expect.any(Number),
      username: "new username",
    });

    await request(app)
      .get(RouterPath.users)
      .expect(HTTP_STATUSES.OK_200, [createdEntity1]);
  });

  let createdEntity2: any = null;
  it(`create one more entity`, async () => {
    const data: CreateUserModel = { username: "new username" };

    const createResponse = await request(app)
      .post(RouterPath.users)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    createdEntity2 = createResponse.body.expect(createdEntity2).toEqual({
      id: expect.any(Number),
      username: data.username,
    });

    await request(app)
      .get(RouterPath.users)
      .expect(HTTP_STATUSES.OK_200, [createdEntity1, createdEntity2]);
  });

  it(`shouldn't update entity with incorrect input data`, async () => {
    const data: CreateUserModel = { username: "" };

    await request(app)
      .put(`${RouterPath.users}/${createdEntity1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`${RouterPath.users}/${createdEntity1.id}`)
      .expect(HTTP_STATUSES.OK_200);
  });

  it(`should update entity with correct input data`, async () => {
    const data: UpdateUserModel = { username: "Andrey" };

    await request(app)
      .put(`${RouterPath.users}/${createdEntity1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${RouterPath.users}/${createdEntity1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdEntity1,
        username: data.username,
      });

    await request(app)
      .get(`${RouterPath.users}/${createdEntity2.id}`)
      .expect(HTTP_STATUSES.OK_200, createdEntity2);
  });

  it(`should delete both entity`, async () => {
    await request(app)
      .delete(`${RouterPath.users}/${createdEntity1.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${RouterPath.users}/${createdEntity1.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app)
      .delete(`${RouterPath.users}/${createdEntity2.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${RouterPath.users}/${createdEntity2.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app).get(RouterPath.users).expect(HTTP_STATUSES.OK_200, []);
  });

  afterAll((done) => {
    done();
  });
});
