import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { User } from "@/lib/types";
import prisma from "@/lib/prisma";
import Loader from "@/components/ui/loader";

export default async function AppPage() {
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

  const userEmail = session.user?.email;

  if (!userEmail) {
    throw new Error("No email found in session");
  }

  if(session) {
    const userExists = await prisma.user.findUnique({
      where : {
        email : userEmail,
      },
    });

    if(userExists) {
      console.log("User Already Exists");
    }

    if (!userExists) {
      const newUser = await prisma.user.create({
        data: {
          name: session.user?.name,
          email: userEmail,
          image: `https://ui-avatars.com/api/?name=${session.user?.name}`,
        },
      });
      console.log("Saved User in Database");
    }

    return redirect("/app/dashboard");
  }

  // If the user is logged in, show the timeline and logout button
  return (
    <Loader />
  );
}
