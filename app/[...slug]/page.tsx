import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function CatchAllPage({ params }) {
  const path = params?.slug?.join("/") || "";

  if (path === "privacy" || path === "terms") {
    redirect(`/?path=${path}`);
  }

  redirect("/");
}
