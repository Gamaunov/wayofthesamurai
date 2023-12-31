import { Request } from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export type ErrorsMessages = {
  message: string
  field: string
}

export type ErrorType = {
  errorsMessages: ErrorsMessages[]
}
