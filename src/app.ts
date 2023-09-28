import express from 'express'
import { getProductsRouter } from './routes/products-router'
import { getTestsRouter } from './routes/tests'

export const app = express()

export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

export const RouterPath = {
  products: '/products',

  __test__: '/__test__',
}

app.use(RouterPath.products, getProductsRouter())
app.use(RouterPath.__test__, getTestsRouter())
// app.use(RouterPath.users, getUsersRouter(db));
