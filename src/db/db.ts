import { MongoClient } from 'mongodb'

export type ProductType = {
  id: number
  title: string
}

const mongoURI = 'mongodb://0.0.0.0:27017'

const client = new MongoClient(mongoURI)
const db = client.db('shop')
export const productsCollection = db.collection<ProductType>('products')

export async function runDb() {
  try {
    await client.connect()

    await client.db('products').command({ ping: 1 })

    console.log('Successfully connected to mongo server')
  } catch {
    console.log("Smth went wrong, can't connect to mongoDb")
    await client.close()
  }
}
