import { redirect } from "next/navigation";

export default function CatchAllPage({ params }) {
  const path = params?.slug?.join("/") || "";

  if (path === "privacy" || path === "terms") {
    redirect(`/?path=${path}`);
  }

  redirect("/");
}
