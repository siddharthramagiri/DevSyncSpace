import { useState, useEffect, useCallback } from 'react';
import { ChatWithDetails } from './useChats';

export function useChat(chatId: string | null) {
  const [chat, setChat] = useState<ChatWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChat = useCallback(async () => {
    if (!chatId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/chats/${chatId}`);
      if (!response.ok) throw new Error('Failed to fetch chat');
      const data = await response.json();
      setChat(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return {
    chat,
    loading,
    error,
    refetch: fetchChat
  };
}