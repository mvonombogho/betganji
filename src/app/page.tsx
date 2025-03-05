import { redirect } from 'next/navigation';

export default function Home() {
  // Force direct redirect to dashboard - no login needed for development
  redirect('/dashboard');
  
  // This is just a fallback that should never be seen
  return null;
}
