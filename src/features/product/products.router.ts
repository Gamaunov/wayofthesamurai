import express, { Response } from 'express'
import { ProductViewModel } from './models/ProductViewModel'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../../types'
import { QueryProductModel } from './models/QueryProductModel'
import { CreateProductModel } from './models/CreateProductModel'
import { productsRepository } from '../../repositories/products-repository'
import { DBType, db } from '../../db/db'

export const getProductsRouter = (db: DBType) => {
  const router = express.Router()

  router.get(
    '/',
    (
      req: RequestWithQuery<QueryProductModel>,
      res: Response<ProductViewModel[]>,
    ) => {
      const foundProducts = productsRepository.findProducts(
        req.query.title?.toString(),
      )
      res.send(foundProducts)
    },
  )

  router.get(
    `/:id`,
    (
      req: RequestWithParams<{ id: string }>,
      res: Response<ProductViewModel>,
    ) => {
      let product = productsRepository.getProductById(+req.params.id)
      product ? res.send(product) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    (
      req: RequestWithBody<CreateProductModel>,
      res: Response<ProductViewModel>,
    ) => {
      const newProduct = productsRepository.createProduct(req.body.title)
      res.status(201).send(newProduct)
    },
  )

  router.delete(`/:id`, (req: RequestWithParams<{ id: string }>, res) => {
    const isDeleted = productsRepository.deleteProduct(+req.params.id)
    if (isDeleted) {
      res.send(204)
    } else {
      res.send(404)
    }
  })

  router.put(
    `/:id`,
    (req: RequestWithParamsAndBody<{ id: string }, { title: string }>, res) => {
      const isUpdated = productsRepository.updateProduct(
        +req.params.id,
        req.body.title,
      )
      if (isUpdated) {
        const product = productsRepository.getProductById(+req.params.id)
        res.send(product)
      } else {
        res.send(404)
      }
    },
  )

  return router
}
