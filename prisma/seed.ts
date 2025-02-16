import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test competition
  const premierLeague = await prisma.competition.create({
    data: {
      name: 'Premier League',
      country: 'England',
    },
  });

  // Create test teams
  const arsenal = await prisma.team.create({
    data: {
      name: 'Arsenal',
      logo: 'https://example.com/arsenal.png',
    },
  });

  const chelsea = await prisma.team.create({
    data: {
      name: 'Chelsea',
      logo: 'https://example.com/chelsea.png',
    },
  });

  // Create test match
  const match = await prisma.match.create({
    data: {
      homeTeamId: arsenal.id,
      awayTeamId: chelsea.id,
      competitionId: premierLeague.id,
      datetime: new Date('2024-02-20T15:00:00Z'),
      status: 'SCHEDULED',
    },
  });

  // Create test odds
  await prisma.odds.create({
    data: {
      matchId: match.id,
      provider: 'TEST_PROVIDER',
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.2,
      timestamp: new Date(),
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });