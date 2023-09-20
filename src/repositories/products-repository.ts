import { db } from '../db/db'

export const productsRepository = {
  findProducts(title: string | null | undefined) {
    if (title) {
      let filteredProducts = db.products.filter(
        (p) => p.title.indexOf(title) > -1,
      )
      return filteredProducts
    } else {
      return db.products
    }
  },

  getProductById(id: number) {
    let product = db.products.find((p) => p.id === id)
    return product
  },

  createProduct(title: string) {
    const newProduct = {
      id: +new Date(),
      title: title,
      studentsCount: 0,
    }
    db.products.push(newProduct)
    return newProduct
  },

  updateProduct(id: number, title: string) {
    let product = db.products.find((p) => p.id === id)
    if (product) {
      product.title = title
      return true
    } else {
      return false
    }
  },

  deleteProduct(id: number) {
    for (let i = 0; i < db.products.length; i++) {
      if (db.products[i].id === id) {
        db.products.splice(i, 1)
        return true
      }
    }
    return false
  },
}
