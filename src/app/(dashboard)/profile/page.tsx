import { getServerSession } from '@/lib/auth/verify';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return user;
}

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const user = await getUserProfile(session.userId);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Name:</span> {user.name || 'Not set'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Member since:</span>{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Placeholder for Stats Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Statistics Overview</h2>
        <p className="text-gray-500">Statistics will be displayed here</p>
      </div>

      {/* Placeholder for Prediction History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Predictions</h2>
        <p className="text-gray-500">Recent predictions will be displayed here</p>
      </div>
    </div>
  );
}
