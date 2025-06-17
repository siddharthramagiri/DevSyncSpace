// hooks/useMessages.ts - Fix message handling and prevent duplicates
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, User } from '@/lib/types';
import { useSocket } from './useSocket';

export interface MessageWithSender extends Message {
  sender: Pick<User, 'id' | 'name' | 'email' | 'image' | 'createdAt'>;
}

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();
  const currentChatId = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    if (!chatId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/chat/${chatId}/messages?page=${pageNum}&limit=50`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      if (reset) {
        setMessages(data);
      } else {
        setMessages(prev => [...data, ...prev]);
      }
      setHasMore(data.length === 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Real-time: join room and listen for new messages
  useEffect(() => {
    if (!socket || !chatId || !isConnected) return;

    // Leave previous room if changing chats
    if (currentChatId.current && currentChatId.current !== chatId) {
      socket.emit("leave", currentChatId.current);
    }

    // Join new room
    socket.emit("join", chatId);
    currentChatId.current = chatId;

    const handleNewMessage = (message: MessageWithSender) => {
      console.log("Received new message:", message);
      setMessages(prev => {
        // Prevent duplicate messages
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
      if (currentChatId.current) {
        socket.emit("leave", currentChatId.current);
      }
    };
  }, [socket, chatId, isConnected]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatId || !content.trim()) return;

    try {
      const response = await fetch(`/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      const newMessage = await response.json();
      
      // Add message locally (for immediate feedback)
      setMessages(prev => [...prev, newMessage]);
      
      // Emit to socket for other users
      if (socket && isConnected) {
        socket.emit("send-message", { chatId, message: newMessage });
      }
      
      return newMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [chatId, socket, isConnected]);

  const loadMoreMessages = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, false);
    }
  }, [hasMore, loading, page, fetchMessages]);

  // Reset when chat changes
  useEffect(() => {
    if (chatId) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      setError(null);
      fetchMessages(1, true);
    }
  }, [chatId, fetchMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  return {
    messages,
    loading,
    error,
    hasMore,
    sendMessage,
    loadMoreMessages,
    messagesEndRef,
    scrollToBottom,
    isConnected
  };
}