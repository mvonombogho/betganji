import type { User } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string
      email: string
    }
  }
}

interface SafeUser {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: Date
}