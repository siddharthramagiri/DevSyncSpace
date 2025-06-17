export function getChatDisplayName(
  chat: any,
  currentUserId: string
): string {
  if (chat.isGroup) {
    return chat.name || chat.team?.name || 'Group Chat';
  }
  
  const otherMember = chat.members?.find((m: any) => m.user.id !== currentUserId);
  return otherMember?.user.name || otherMember?.user.email || 'Unknown User';
}

export function formatMessageTime(date: string): string {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return `Yesterday ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return messageDate.toLocaleDateString();
  }
}

export function truncateMessage(message: string, maxLength: number = 50): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
}