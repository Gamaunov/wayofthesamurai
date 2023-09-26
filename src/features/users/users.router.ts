import { DBType, UserType } from '../../db/db'
import express, { Response } from 'express'
import { HTTP_STATUSES } from '../../utils'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../../types'
import { UserViewModel } from './models/UserViewModel'
import { CreateUserModel } from './models/CreateUserModel'
import { QueryUserModel } from './models/QueryUserModel'
import { usersRepository } from '../../repositories/users-repository'

export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
  return {
    id: dbEntity.id,
    username: dbEntity.username,
  }
}

export const getUsersRouter = (db: DBType) => {
  const router = express.Router()

  router.get(
    '/',
   async (req: RequestWithQuery<QueryUserModel>, res: Response<UserViewModel[]>) => {
      const foundUser =await usersRepository.findUser(req.query.username?.toString())
      res.send(foundUser)
    },
  )

  router.get(
    `/:id`,
   async (req: RequestWithParams<{ id: string }>, res: Response<UserViewModel>) => {
      let user =await usersRepository.getUserById(+req.params.id)
      user ? res.send(user) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
   async (req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel>) => {
      const newUser =await usersRepository.createUser(req.body.username)
      res.status(201).send(newUser)
    },
  )

  router.delete(`/:id`,async (req: RequestWithParams<{ id: string }>, res) => {
    const isDeleted =await usersRepository.deleteUser(+req.params.id)
    if (isDeleted) {
      res.send(204)
    } else {
      res.sendStatus(404)
    }
  })

  router.put(
    `/:id`,
   async (
      req: RequestWithParamsAndBody<{ id: string }, { username: string }>,
      res,
    ) => {
      const isUpdated =await usersRepository.updateUser(
        +req.params.id,
        req.body.username,
      )
      if (isUpdated) {
        const user = usersRepository.getUserById(+req.params.id)
        res.send(user)
      } else {
        res.sendStatus(404)
      }
    },
  )

  return router
}
