import React from 'react';

type UserDropdownMenuProps = {
  onLogout: () => void;
};

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ onLogout }) => (
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      Profile
    </button>
    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      Settings
    </button>
    <button
      onClick={onLogout}
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      Log Out
    </button>
  </div>
);

export default UserDropdownMenu;