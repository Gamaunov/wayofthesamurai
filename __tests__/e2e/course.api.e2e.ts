import request from "supertest";
import { app, RouterPath } from "../../src/app";
import { CreateCourseModel } from "../../src/features/courses/models/CreateCourseModel";
import { HTTP_STATUSES } from "../../src/utils";
import { UpdateCourseModel } from "../../src/features/courses/models/UpdateCourseModel";

const getRequest = () => {
  return request(app);
};

describe("courses", () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPath.__test__}/data`);
  });

  it("should return 200 and empty array", async () => {
    await getRequest().get(RouterPath.courses).expect(HTTP_STATUSES.OK_200, []);
  });

  it(`should return 404 for not existing course`, async () => {
    await request(app)
      .get(`${RouterPath.courses}/123`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it(`shouldn't create course with incorrect input data`, async () => {
    const data: CreateCourseModel = { username: "" };

    await request(app)
      .post(RouterPath.courses)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app).get(RouterPath.courses).expect(HTTP_STATUSES.OK_200);
  });

  let createdCourse1: any = null;
  it(`should create course with correct input data`, async () => {
    const data: CreateCourseModel = { username: "new title" };

    const createResponse = await request(app)
      .post(RouterPath.courses)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse1 = createResponse.body.expect(createdCourse1).toEqual({
      id: expect.any(Number),
      title: "new title",
    });

    await request(app)
      .get(RouterPath.courses)
      .expect(HTTP_STATUSES.OK_200, [createdCourse1]);
  });

  let createdCourse2: any = null;
  it(`create one more course`, async () => {
    const data: CreateCourseModel = { username: "new title" };

    const createResponse = await request(app)
      .post(RouterPath.courses)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse2 = createResponse.body.expect(createdCourse2).toEqual({
      id: expect.any(Number),
      title: data.username,
    });

    await request(app)
      .get(RouterPath.courses)
      .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2]);
  });

  it(`shouldn't update course with incorrect input data`, async () => {
    const data: CreateCourseModel = { username: "" };

    await request(app)
      .put(`${RouterPath.courses}/${createdCourse1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`${RouterPath.courses}/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.OK_200);
  });

  it(`shouldn't update course that not exist`, async () => {
    await request(app)
      .put(`${RouterPath.courses}/${-100}`)
      .send({ title: "new title" })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it(`should update course with correct input data`, async () => {
    const data: UpdateCourseModel = { title: "new title" };

    await request(app)
      .put(`${RouterPath.courses}/${createdCourse1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${RouterPath.courses}/${createdCourse1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdCourse1,
        title: data.title,
      });

    await request(app)
      .get(`${RouterPath.courses}/${createdCourse2.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse2);
  });

  it(`should delete both courses`, async () => {
    await request(app)
      .delete(`${RouterPath.courses}/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${RouterPath.courses}/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app)
      .delete(`${RouterPath.courses}/${createdCourse2.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${RouterPath.courses}/${createdCourse2.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app).get(RouterPath.courses).expect(HTTP_STATUSES.OK_200, []);
  });

  afterAll((done) => {
    done();
  });
});
