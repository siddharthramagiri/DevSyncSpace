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
import { MessageCircle, Plus, ArrowLeft } from 'lucide-react';

export function MobileChatContainer() {
  const [selectedChat, setSelectedChat] = useState<ChatWithDetails | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const { chat } = useChat(selectedChat?.id || null);
  const { sendMessage } = useMessages(selectedChat?.id || null);

  const handleChatSelect = (chat: ChatWithDetails) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleChatCreated = (chatId: string) => {
    setShowChatList(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile: Show either chat list or chat view */}
      <div className="w-full flex flex-col">
        {showChatList ? (
          // Chat List View
          <>
            <div className="p-4 bg-white border-b border-gray-200">
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
            
            <div className="flex-1 overflow-y-auto bg-white">
              <ChatList
                onChatSelect={handleChatSelect}
                selectedChatId={selectedChat?.id}
              />
            </div>
          </>
        ) : selectedChat ? (
          // Chat View
          <>
            <div className="bg-white border-b border-gray-200">
              <div className="flex items-center p-4">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <ChatHeader chat={chat || selectedChat} />
                </div>
              </div>
            </div>
            <MessageList chatId={selectedChat.id} />
            <MessageInput onSendMessage={sendMessage} />
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center">
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
