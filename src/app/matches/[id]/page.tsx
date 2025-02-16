import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

interface MatchPageProps {
  params: {
    id: string;
  };
}

async function getMatchData(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      odds: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  });

  if (!match) {
    return null;
  }

  return { match };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const data = await getMatchData(params.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {data.match.homeTeam.name} vs {data.match.awayTeam.name}
      </h1>
      {/* Match components will be added here */}
    </div>
  );
}
