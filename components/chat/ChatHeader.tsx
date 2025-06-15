'use client';

import { ChatWithDetails } from '@/hooks/useChats';
import { useSession } from 'next-auth/react';
import { Users, User, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  chat: ChatWithDetails;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const { data: session } = useSession();

  const getChatDisplayName = () => {
    if (chat.isGroup) {
      return chat.name || chat.team?.name || 'Group Chat';
    }
    
    const otherMember = chat.members.find(m => m.user.email !== session?.user?.email);
    return otherMember?.user.name || otherMember?.user.email || 'Unknown User';
  };

  const getChatAvatar = () => {
    if (chat.isGroup) {
      return <Users className="w-8 h-8 p-1 bg-blue-100 text-blue-600 rounded-full" />;
    }
    
    const otherMember = chat.members.find(m => m.user.email !== session?.user?.email);
    if (otherMember?.user.image) {
      return (
        <img
          src={otherMember.user.image}
          alt={otherMember.user.name || 'User'}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    
    return <User className="w-8 h-8 p-1 bg-gray-100 text-gray-600 rounded-full" />;
  };

  const getMemberCount = () => {
    if (!chat.isGroup) return null;
    return `${chat.members.length} members`;
  };

  return (
    <div className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getChatAvatar()}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {getChatDisplayName()}
            </h2>
            {getMemberCount() && (
              <p className="text-sm text-gray-500">{getMemberCount()}</p>
            )}
            {chat.team && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {chat.team.name}
              </span>
            )}
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}