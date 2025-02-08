// src/lib/utils/validation/index.ts
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const isValidPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return passwordRegex.test(password)
  }
  
  export const isValidUsername = (username: string): boolean => {
    // 3-20 characters, letters, numbers, underscores, hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    return usernameRegex.test(username)
  }