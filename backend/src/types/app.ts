export type AppUser = {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export type AppBindings = {
  Variables: {
    user: AppUser
  }
}