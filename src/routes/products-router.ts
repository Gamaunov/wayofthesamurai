import express, { Response, Request } from 'express'
import { body } from 'express-validator'
import {
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types'
import { productsService } from '../domain/products-service'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { QueryProductModel } from '../models/product/QueryProductModel'
import { ProductViewModel } from '../models/product/ProductViewModel'

const titleValidation = body('title')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('Title length should be from 3 to 10 symbols')

export const getProductsRouter = () => {
  const router = express.Router()

  router.get(
    '/',
    async (
      req: RequestWithQuery<QueryProductModel>,
      res: Response<ProductViewModel[]>,
    ) => {
      const foundProducts = await productsService.findProducts(
        req.query.title?.toString(),
      )
      res.send(foundProducts)
    },
  )

  router.get(
    `/:id`,
    async (
      req: RequestWithParams<{ id: string }>,
      res: Response<ProductViewModel>,
    ) => {
      let product = await productsService.findProductById(+req.params.id)
      product ? res.send(product) : res.sendStatus(404)
    },
  )

  router.post(
    '/',
    titleValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const newProduct = await productsService.createProduct(req.body.title)
      return res.status(201).send(newProduct)
    },
  )

  router.delete(`/:id`, async (req: RequestWithParams<{ id: string }>, res) => {
    const isDeleted = await productsService.deleteProduct(+req.params.id)
    if (isDeleted) {
      res.send(204)
    } else {
      res.send(404)
    }
  })

  router.put(
    `/:id`,
    titleValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const isUpdated = await productsService.updateProduct(
        +req.params.id,
        req.body.title,
      )
      if (isUpdated) {
        const product = await productsService.findProductById(+req.params.id)
        res.send(product)
      } else {
        res.send(404)
      }
    },
  )

  return router
}
