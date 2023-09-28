import { ProductType, productsCollection } from '../db/db'

const _products: ProductType[] = [
  { id: 0, title: 'title' },
  { id: 2, title: 'new title' },
]

export const productsRepository = {
  async findProducts(title: string | null | undefined): Promise<ProductType[]> {
    const filter: any = {}

    if (title) {
      filter.title = { $regex: title }
    }

    return productsCollection.find(filter).toArray()
  },

  async findProductById(id: number): Promise<ProductType | null> {
    let product: ProductType | null = await productsCollection.findOne({ id })

    if (product) {
      return product
    } else {
      return null
    }
  },

  async createProduct(title: string): Promise<ProductType> {
    const newProduct = {
      id: +new Date(),
      title: title,
      studentsCount: 0,
    }
    const result = await productsCollection.insertOne(newProduct)

    return newProduct
  },

  async updateProduct(id: number, title: string): Promise<boolean> {
    const result = await productsCollection.updateOne(
      { id: id },
      { $set: { title: title } },
    )

    return result.matchedCount === 1
  },

  async deleteProduct(id: number): Promise<boolean> {
    const result = await productsCollection.deleteOne({ id: id })

    return result.deletedCount === 1
  },
}
