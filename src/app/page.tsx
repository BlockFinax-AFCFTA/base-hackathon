import { redirect } from 'next/navigation';

// Home page component - Server Component
export default function Home() {
  // Redirect to dashboard page
  redirect('/dashboard');
}