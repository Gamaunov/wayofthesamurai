import { ProductType } from '../db/db'

const products: ProductType[] = [
  { id: 0, title: 'title' },
  { id: 2, title: 'new title' },
]

export const productsRepository = {
  async findProducts(title: string | null | undefined): Promise<ProductType[]> {
    if (title) {
      let filteredProducts = products.filter((p) => p.title.indexOf(title) > -1)
      return filteredProducts
    } else {
      return products
    }
  },

  async findProductById(id: number): Promise<ProductType | null> {
    let product = products.find((p) => p.id === id)
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
    products.push(newProduct)
    return newProduct
  },

  async updateProduct(id: number, title: string): Promise<boolean> {
    let product = products.find((p) => p.id === id)
    if (product) {
      product.title = title
      return true
    } else {
      return false
    }
  },

  async deleteProduct(id: number): Promise<boolean> {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        products.splice(i, 1)
        return true
      }
    }
    return false
  },
}
