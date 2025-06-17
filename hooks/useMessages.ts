// hooks/useMessages.ts
'use client'
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
  const socket = useSocket();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    if (!chatId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/chat/${chatId}/messages?page=${pageNum}&limit=50`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      if (reset) {
        setMessages(data);
      } else {
        setMessages(prev => [...data, ...prev]);
      }
      console.log(reset ? data : [...data, ...messages]);
      setHasMore(data.length === 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [chatId, messagesEndRef]);

  // Real-time: join room and listen for new messages
  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit("join", chatId);

    const handler = (message: MessageWithSender) => {
      setMessages(prev => [...prev, message]);
    };
    socket.on("new-message", handler);

    return () => {
      socket.emit("leave", chatId);  // Leave room on unmount/change
      socket.off("new-message", handler);
    };
  }, [socket, chatId]);

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
      setMessages(prev => [...prev, newMessage]);
      // Emit to socket
      if (socket) {
        socket.emit("send-message", { chatId, message: newMessage });
      }
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [chatId, socket]);

  const loadMoreMessages = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, false);
    }
  }, [hasMore, loading, page, fetchMessages]);

  useEffect(() => {
    if (chatId) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      fetchMessages(1, true);
    }
  }, [chatId, fetchMessages]);

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
    scrollToBottom
  };
}