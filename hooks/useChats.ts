
// hooks/useChats.ts
import { useState, useEffect, useCallback } from 'react';
import { Chat, Message, User } from '@/lib/types';

export interface ChatWithDetails extends Chat {
  members: Array<
    NonNullable<Chat['members']>[number] & {
      user: Pick<User, 'id' | 'name' | 'email' | 'image'>;
    }
  >;
  messages: Array<Message & {
    sender: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  }>;
  team?: {
    id: string;
    name: string;
    createdAt: string;
    leaderId: string;
  };
}

export function useChats() {
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chats');
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDirectChat = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/chats/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to create chat');
      const newChat = await response.json();
      setChats(prev => [newChat, ...prev.filter(c => c.id !== newChat.id)]);
      return newChat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat');
      throw err;
    }
  }, []);

  const createGroupChat = useCallback(async (name: string, memberIds: string[], teamId?: string) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          isGroup: true, 
          memberIds,
          teamId 
        })
      });
      if (!response.ok) throw new Error('Failed to create group chat');
      const newChat = await response.json();
      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group chat');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    loading,
    error,
    refetch: fetchChats,
    createDirectChat,
    createGroupChat
  };
}
