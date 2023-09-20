import express from 'express'
import { HTTP_STATUSES } from '../utils'
import { DBType } from '../db/db'

export const getTestsRouter = (db: DBType) => {
  const router = express.Router()

  router.delete('/data', (req, res) => {
    db.products = []
    db.users = []
    db.studentCourseBindings = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  })

  return router
}
