import { db } from '../db/db'

export const usersRepository = {
  async findUser(username: string | null | undefined) {
    if (username) {
      let users = db.users.filter((p) => p.username.indexOf(username) > -1)
      return users
    } else {
      return db.users
    }
  },

  async getUserById(id: number) {
    let User = db.users.find((p) => p.id === id)
    return User
  },

  async createUser(username: string) {
    const newUser = {
      id: +new Date(),
      username: username,
      studentsCount: 0,
    }
    db.users.push(newUser)
    return newUser
  },

  async updateUser(id: number, username: string) {
    let User = db.users.find((p) => p.id === id)
    if (User) {
      User.username = username
      return true
    } else {
      return false
    }
  },

  async deleteUser(id: number) {
    for (let i = 0; i < db.users.length; i++) {
      if (db.users[i].id === id) {
        db.users.splice(i, 1)
        return true
      }
    }
    return false
  },
}
