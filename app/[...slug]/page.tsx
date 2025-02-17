import { redirect } from "next/navigation";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function CatchAllPage({ params }: PageProps) {
  const path = params.slug?.join("/") || "";

  if (path === "privacy" || path === "terms") {
    redirect(`/?path=${path}`);
  }

  redirect("/");
}
