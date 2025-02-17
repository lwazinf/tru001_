import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function CatchAllPage({ params }: PageProps) {
  const path = params.slug.join('/');
  
  // Only allow specific paths
  if (path === 'privacy' || path === 'terms') {
    redirect('/?path=' + path);
  }
  
  // For any other paths, redirect to home
  redirect('/');
}