import React from 'react';
import UserDropdownMenu from './UserDropdownMenu';
import { User } from '../../../types/common';

type HeaderProps = {
  user: User | null;
  showMenu: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
};

const Header: React.FC<HeaderProps> = ({ user, showMenu, onToggleMenu, onLogout }) => (
  <div className="bg-white p-4 flex justify-between items-center shadow">
    <h1 className="text-xl font-bold">Chats</h1>
    <div className="relative">
      {user && (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={onToggleMenu}
        />
      )}
      {showMenu && (
        <UserDropdownMenu onLogout={onLogout} />
      )}
    </div>
  </div>
);

export default Header;