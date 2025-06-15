// components/chat/MessageList.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useSession } from 'next-auth/react';
import { format, isToday, isYesterday } from 'date-fns';
import { ChevronUp } from 'lucide-react';

interface MessageListProps {
  chatId: string;
}

export function MessageList({ chatId }: MessageListProps) {
  const { data: session } = useSession();
  const { messages, loading, hasMore, loadMoreMessages, messagesEndRef } = useMessages(chatId);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`;
    } else {
      return format(messageDate, 'MMM d, HH:mm');
    }
  };

  const shouldShowDateSeparator = (currentMessage: any, previousMessage: any) => {
    if (!previousMessage) return true;
    const current = new Date(currentMessage.createdAt);
    const previous = new Date(previousMessage.createdAt);
    return current.toDateString() !== previous.toDateString();
  };

  const formatDateSeparator = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return 'Today';
    if (isYesterday(messageDate)) return 'Yesterday';
    return format(messageDate, 'MMMM d, yyyy');
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {hasMore && (
        <button
          onClick={loadMoreMessages}
          disabled={loading}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center justify-center gap-1"
        >
          <ChevronUp className="w-4 h-4" />
          {loading ? 'Loading...' : 'Load more messages'}
        </button>
      )}

      {messages.map((message, index) => {
        const isOwnMessage = message.sender.email === session?.user?.email;
        const previousMessage = messages[index - 1];
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage);

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                  {formatDateSeparator(message.createdAt)}
                </span>
              </div>
            )}
            
            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                {!isOwnMessage && (
                  <div className="flex items-center mb-1">
                    {message.sender.image ? (
                      <img
                        src={message.sender.image}
                        alt={message.sender.name || 'User'}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {message.sender.name?.[0] || message.sender.email[0]}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-gray-600">
                      {message.sender.name || message.sender.email}
                    </span>
                  </div>
                )}
                
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                <div className={`mt-1 text-xs text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                  {formatMessageTime(message.createdAt)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
