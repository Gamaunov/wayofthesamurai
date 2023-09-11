import express, { Request, Response } from 'express'

const app = express()
const port = 3001

app.get('/', (req: Request, res: Response) => {
  let helloMessage = 'my message'
  res.send(helloMessage)
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
