import { ProductType } from '../db/db'
import { productsRepository } from '../repositories/products-db-repository'

export const productsService = {
  async findProducts(title: string | null | undefined): Promise<ProductType[]> {
    return productsRepository.findProducts(title)
  },

  async findProductById(id: number): Promise<ProductType | null> {
    return productsRepository.findProductById(id)
  },

  async createProduct(title: string): Promise<ProductType> {
    const newProduct = {
      id: +new Date(),
      title: title,
    }
    const createdProduct = await productsRepository.createProduct(newProduct)

    return createdProduct
  },

  async updateProduct(id: number, title: string): Promise<boolean> {
    return productsRepository.updateProduct(id, title)
  },

  async deleteProduct(id: number): Promise<boolean> {
    return productsRepository.deleteProduct(id)
  },
}
