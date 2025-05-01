
import Index from "@/components/Index";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";


export default async function Home() {
  const session = await getServerSession(authConfig);
  console.log("Session: ", session);
  if (session) return redirect("/app");
  
  
  return (
    <Index />
  );
}
