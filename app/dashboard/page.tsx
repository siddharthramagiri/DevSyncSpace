import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function TimelinePage() {
  // Fetch the session to check if the user is logged in
  const session = await getServerSession(authConfig);

  // If the user is not logged in, you can redirect or show a message
  if (!session) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">You are not logged in</h1>
      </div>
    );
  }

  // If the user is logged in, show the timeline and logout button
  return (
    <>
    </>
  );
}
