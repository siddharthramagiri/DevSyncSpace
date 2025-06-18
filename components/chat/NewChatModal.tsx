'use client';

import { useState, useEffect } from 'react';
import { useChats } from '@/hooks/useChats';
import { User, Team } from '@/lib/types';
import { X, Search, Users, MessageCircle } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chatId: string) => void;
}

export function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const { createDirectChat, createGroupChat } = useChats();
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [chatName, setChatName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchTeams();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateChat = async () => {
    if (loading) return;

    setLoading(true);
    try {
      let newChat;
      
      if (isGroup) {
        if (selectedUsers.length === 0) {
          alert('Please select at least one member');
          return;
        }
        newChat = await createGroupChat(chatName, selectedUsers, selectedTeam || undefined);
      } else {
        if (selectedUsers.length !== 1) {
          alert('Please select exactly one user for direct chat');
          return;
        }
        newChat = await createDirectChat(selectedUsers[0]);
      }

      onChatCreated(newChat.id);
      resetModal();
      onClose();
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedUsers([]);
    setSelectedTeam(null);
    setChatName('');
    setSearchTerm('');
    setIsGroup(false);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">New Chat</h2>
        <button
          onClick={() => {
            resetModal();
            onClose();
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Chat Type Selection */}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsGroup(false)}
            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
              !isGroup
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-1" />
            Direct Chat
          </button>
          <button
            onClick={() => setIsGroup(true)}
            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
              isGroup
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            Group Chat
          </button>
        </div>

        {/* Group Chat Name */}
        {isGroup && (
          <input
            type="text"
            placeholder="Group chat name (optional)"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Team Selection for Group Chats */}
        {isGroup && teams.length > 0 && (
          <select
            value={selectedTeam || ''}
            onChange={(e) => setSelectedTeam(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No team (optional)</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        )}

        {/* User Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User List */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => toggleUserSelection(user.id)}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedUsers.includes(user.id)
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <input
                type={isGroup ? 'checkbox' : 'radio'}
                name="userSelection"
                checked={selectedUsers.includes(user.id)}
                onChange={() => {}}
                className="text-blue-600"
              />
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-600">
                    {user.name?.[0] || user.email[0]}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || user.email}
                </p>
                {user.name && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4 flex justify-end space-x-2">
        <button
          onClick={() => {
            resetModal();
            onClose();
          }}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateChat}
          disabled={loading || selectedUsers.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Chat'}
        </button>
      </div>
    </div>
  </div>
);

}
