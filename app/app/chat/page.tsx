// app/chat/page.tsx
import { ChatContainer } from '@/components/chat/chatContainer';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ChatPage() {
  const session = await getServerSession(authConfig);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="h-11/12 overflow-hidden">
      <ChatContainer />
    </div>
  );
}
