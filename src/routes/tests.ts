import express from 'express'

export const getTestsRouter = () => {
  const router = express.Router()

  router.delete('/data', (req, res) => {
    // db.products = []
    // db.users = []
    // db.studentCourseBindings = []
    res.sendStatus(204)
  })

  return router
}
