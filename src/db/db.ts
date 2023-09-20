export type UserType = {
  id: number
  username: string
}

export type AddressType = {
  id: number
  value: string
}

export type ProductsType = {
  id: number
  title: string
  studentsCount: number
}

export type StudentCourseBindings = {
  studentId: number
  courseId: number
  date: Date
}

export type DBType = {
  products: ProductsType[]
  users: UserType[]
  addresses: AddressType[]
  studentCourseBindings: StudentCourseBindings[]
}

export const db: DBType = {
  products: [
    { id: 1, title: 'front-end', studentsCount: 10 },
    { id: 2, title: 'back-end', studentsCount: 10 },
    { id: 3, title: 'qa', studentsCount: 10 },
    { id: 4, title: 'devops', studentsCount: 10 },
  ],
  users: [
    { id: 1, username: 'dimych' },
    { id: 2, username: 'not-dimych' },
  ],
  addresses: [
    { id: 1, value: 'central park' },
    { id: 2, value: 'Pushkina, 12' },
  ],
  studentCourseBindings: [
    { studentId: 1, courseId: 2, date: new Date(2023, 8, 1) },
    { studentId: 2, courseId: 2, date: new Date(2023, 8, 1) },
    { studentId: 3, courseId: 3, date: new Date(2023, 8, 1) },
  ],
}
