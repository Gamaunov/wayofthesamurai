import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

const products = [
  { id: 1, title: 'tomato' },
  { id: 2, title: 'orange' },
]
const addresses = [
  { id: 1, value: 'url' },
  { id: 2, title: 'tot' },
]

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.get('/products', (req: Request, res: Response) => {
  if (req.query.title) {
    let searchString = req.query.title?.toString()
    res.send(products.filter((p) => p.title.indexOf(searchString) > -1))
  } else {
    res.send(products)
  }
})

app.post('/products', (req: Request, res: Response) => {
  const newProduct = {
    id: +new Date(),
    title: req.body.title,
  }
  products.push(newProduct)

  res.status(201).send(newProduct)
})

app.get('/products/:id', (req: Request, res: Response) => {
  let product = products.find((p) => p.id === +req.params.id)

  if (product) {
    res.send(product)
  } else {
    res.sendStatus(404)
  }
})

app.put('/products/:id', (req: Request, res: Response) => {
  let product = products.find((p) => p.id === +req.params.id)

  if (product) {
    product.title = req.body.title
    res.send(product)
  } else {
    res.sendStatus(404)
  }
})

app.delete('/products/:id', (req: Request, res: Response) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === +req.params.id) {
      products.splice(i, 1)
      res.sendStatus(204)
      return
    } else {
      res.sendStatus(404)
    }
  }
})

app.get('/addresses', (req: Request, res: Response) => {
  res.send(addresses)
})

app.get('/addresses/:id', (req: Request, res: Response) => {
  let address = addresses.find((i) => i.id === +req.params.id)

  if (address) {
    res.send(address)
  } else {
    res.send(404)
  }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
