import request from 'supertest'
import { app, RouterPath } from '../../src/app'
import { HTTP_STATUSES } from '../../src/utils'
import { CreateProductModel } from '../../src/features/product/models/CreateProductModel'
import { UpdateProductModel } from '../../src/features/product/models/UpdateProductModel'

const getRequest = () => {
  return request(app)
}

describe('product', () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPath.__test__}/data`)
  })

  it('should return 200 and empty array', async () => {
    await getRequest().get(RouterPath.product).expect(HTTP_STATUSES.OK_200, [])
  })

  it(`should return 404 for not existing product`, async () => {
    await request(app)
      .get(`${RouterPath.product}/123`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it(`shouldn't create product with incorrect input data`, async () => {
    const data: CreateProductModel = { title: '' }

    await request(app)
      .post(RouterPath.product)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app).get(RouterPath.product).expect(HTTP_STATUSES.OK_200)
  })

  let createdproduct1: any = null
  it(`should create product with correct input data`, async () => {
    const data: CreateProductModel = { title: 'new title' }

    const createResponse = await request(app)
      .post(RouterPath.product)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)

    createdproduct1 = createResponse.body.expect(createdproduct1).toEqual({
      id: expect.any(Number),
      title: 'new title',
    })

    await request(app)
      .get(RouterPath.product)
      .expect(HTTP_STATUSES.OK_200, [createdproduct1])
  })

  let createdproduct2: any = null
  it(`create one more product`, async () => {
    const data: CreateProductModel = { title: 'new title' }

    const createResponse = await request(app)
      .post(RouterPath.product)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)

    createdproduct2 = createResponse.body.expect(createdproduct2).toEqual({
      id: expect.any(Number),
      title: data.title,
    })

    await request(app)
      .get(RouterPath.product)
      .expect(HTTP_STATUSES.OK_200, [createdproduct1, createdproduct2])
  })

  it(`shouldn't update product with incorrect input data`, async () => {
    const data: CreateProductModel = { title: '' }

    await request(app)
      .put(`${RouterPath.product}/${createdproduct1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app)
      .get(`${RouterPath.product}/${createdproduct1.id}`)
      .expect(HTTP_STATUSES.OK_200)
  })

  it(`shouldn't update product that not exist`, async () => {
    await request(app)
      .put(`${RouterPath.product}/${-100}`)
      .send({ title: 'new title' })
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it(`should update product with correct input data`, async () => {
    const data: UpdateProductModel = { title: 'new title' }

    await request(app)
      .put(`${RouterPath.product}/${createdproduct1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
      .get(`${RouterPath.product}/${createdproduct1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdproduct1,
        title: data.title,
      })

    await request(app)
      .get(`${RouterPath.product}/${createdproduct2.id}`)
      .expect(HTTP_STATUSES.OK_200, createdproduct2)
  })

  it(`should delete both products`, async () => {
    await request(app)
      .delete(`${RouterPath.product}/${createdproduct1.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
      .get(`${RouterPath.product}/${createdproduct1.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)

    await request(app)
      .delete(`${RouterPath.product}/${createdproduct2.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
      .get(`${RouterPath.product}/${createdproduct2.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)

    await request(app).get(RouterPath.product).expect(HTTP_STATUSES.OK_200, [])
  })

  afterAll((done) => {
    done()
  })
})
