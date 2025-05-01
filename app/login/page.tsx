
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import Login from "@/components/Login";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);
  console.log("Session: ", session);
  if (session) return redirect("/app");
  
  
  return (
    <div>
      <Login />
    </div>
  );
}