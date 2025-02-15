import { PrismaClient } from '@prisma/client';
import { generateTestData } from '../support/test-data';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const tasks = {
  // Reset and seed the test database
  async 'db:seed'() {
    try {
      // Clear existing data
      await prisma.$transaction([
        prisma.prediction.deleteMany(),
        prisma.match.deleteMany(),
        prisma.user.deleteMany(),
      ]);

      const testData = generateTestData();

      // Create test users
      for (const [role, userData] of Object.entries(testData.users)) {
        await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            hashedPassword: await bcrypt.hash(userData.password, 12),
          },
        });
      }

      // Create test matches
      for (const match of testData.matches) {
        await prisma.match.create({
          data: {
            id: match.id,
            homeTeam: { create: match.homeTeam },
            awayTeam: { create: match.awayTeam },
            competition: { create: match.competition },
            datetime: new Date(match.datetime),
            h2h: match.h2h,
          },
        });
      }

      // Create test predictions
      for (const prediction of testData.predictions) {
        await prisma.prediction.create({
          data: {
            id: prediction.id,
            matchId: prediction.matchId,
            result: prediction.result,
            confidence: prediction.confidence,
            insights: prediction.insights,
            createdAt: new Date(prediction.createdAt),
          },
        });
      }

      return true;
    } catch (error) {
      console.error('Error seeding database:', error);
      return false;
    }
  },

  // Clear all test data
  async 'db:clear'() {
    try {
      await prisma.$transaction([
        prisma.prediction.deleteMany(),
        prisma.match.deleteMany(),
        prisma.user.deleteMany(),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing database:', error);
      return false;
    }
  },
};
