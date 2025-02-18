import { redirect } from "next/navigation";

type CatchAllPageProps = {
  params: { slug?: string[] };
};

export default function CatchAllPage({ params }: CatchAllPageProps) {
  if (!params?.slug) {
    redirect("/"); // Redirect if no slug is provided
  }

  const path = params.slug.join("/");

  if (path === "privacy" || path === "terms") {
    redirect(`/?path=${path}`);
  } else {
    redirect("/");
  }

  return null; // Ensures function has a valid return type
}
