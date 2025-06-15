// components/chat/ChatList.tsx
'use client';

import { useState } from 'react';
import { useChats, ChatWithDetails } from '@/hooks/useChats';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Users, User } from 'lucide-react';

interface ChatListProps {
  onChatSelect: (chat: ChatWithDetails) => void;
  selectedChatId?: string;
}

export function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const { data: session } = useSession();
  const { chats, loading, error } = useChats();

  const getChatDisplayName = (chat: ChatWithDetails) => {
    if (chat.isGroup) {
      return chat.name || chat.team?.name || 'Group Chat';
    }
    
    const otherMember = chat.members.find(m => m.user.email !== session?.user?.email);
    return otherMember?.user.name || otherMember?.user.email || 'Unknown User';
  };

  const getChatAvatar = (chat: ChatWithDetails) => {
    if (chat.isGroup) {
      return <Users className="w-10 h-10 p-2 bg-blue-100 text-blue-600 rounded-full" />;
    }
    
    const otherMember = chat.members.find(m => m.user.email !== session?.user?.email);
    if (otherMember?.user.image) {
      return (
        <img
          src={otherMember.user.image}
          alt={otherMember.user.name || 'User'}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    
    return <User className="w-10 h-10 p-2 bg-gray-100 text-gray-600 rounded-full" />;
  };

  const getLastMessage = (chat: ChatWithDetails) => {
    const lastMessage = chat.messages[0];
    if (!lastMessage) return 'No messages yet';
    
    const isOwnMessage = lastMessage.sender.email === session?.user?.email;
    const senderName = isOwnMessage ? 'You' : lastMessage.sender.name;
    return `${senderName}: ${lastMessage.content}`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error loading chats: {error}</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No chats yet</p>
        <p className="text-sm">Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onChatSelect(chat)}
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedChatId === chat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {getChatAvatar(chat)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {getChatDisplayName(chat)}
                </h3>
                {chat.messages[0] && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(chat.messages[0].createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {getLastMessage(chat)}
              </p>
              {chat.team && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
                  {chat.team.name}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}