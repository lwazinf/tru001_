import { redirect } from "next/navigation";

interface CatchAllPageProps {
  params: {
    slug?: string[];
  };
}

export default function CatchAllPage({ params }: CatchAllPageProps) {
  const path = params?.slug?.join("/") || "";

  if (path === "privacy" || path === "terms") {
    redirect(`/?path=${path}`);
  }

  redirect("/");
}
