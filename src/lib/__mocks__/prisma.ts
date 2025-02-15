import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>

beforeEach(() => {
  mockReset(prismaMock)
})

export { prismaMock }