import { redirect } from 'next/navigation';

export default function CatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const path = params.slug.join('/');
  
  // Only allow specific paths
  if (path === 'privacy' || path === 'terms') {
    redirect('/?path=' + path);
  }
  
  // For any other paths, redirect to home
  redirect('/');
}