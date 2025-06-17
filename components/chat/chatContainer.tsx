'use client';

import { useState } from 'react';
import { ChatList } from './Chatlist';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { NewChatModal } from './NewChatModal';
import { useChat } from '@/hooks/useChat';
import { useMessages } from '@/hooks/useMessages';
import { ChatWithDetails } from '@/hooks/useChats';
import { MessageCircle, Plus } from 'lucide-react';

export function ChatContainer() {
  const [selectedChat, setSelectedChat] = useState<ChatWithDetails | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const { chat } = useChat(selectedChat?.id || null);
  const { sendMessage } = useMessages(selectedChat?.id || null);

  const handleChatSelect = (chat: ChatWithDetails) => {
    setSelectedChat(chat);
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleChatCreated = (chatId: string) => {
    // The chat list will automatically refresh and show the new chat
    // We could optionally select the new chat here
  };

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
            <button
              onClick={handleNewChat}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 h-full flex flex-col overflow-y-auto">
          <ChatList
            onChatSelect={handleChatSelect}
            selectedChatId={selectedChat?.id}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-full flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader chat={chat || selectedChat} />
            <div className="flex-1 overflow-y-auto">
              <MessageList chatId={selectedChat.id} />
            </div>
            <div className='shrink-0'>
              <MessageInput onSendMessage={sendMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 h-full flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Chat
              </h2>
              <p className="text-gray-500 mb-4">
                Select a chat to start messaging or create a new one
              </p>
              <button
                onClick={handleNewChat}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
}
