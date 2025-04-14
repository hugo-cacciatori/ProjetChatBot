import { Chat as ChatType, User } from './common';

export type Chat = ChatType;

export type ChatSidebarProps = {
  chats: Chat[];
  onCreateNewChat: () => void;
  onChatClick: (chatId: string) => void;
};

export type ChatListItemProps = {
  chat: Chat;
  onClick: () => void;
};

export type MainContentProps = {
  user: User | null;
  showMenu: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
  onCreateNewChat: () => void;
};

export type HeaderProps = {
  user: User | null;
  showMenu: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
};

export type UserDropdownMenuProps = {
  onLogout: () => void;
};

export type EmptyStateProps = {
  onCreateNewChat: () => void;
};