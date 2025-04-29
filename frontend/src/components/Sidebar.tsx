
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, User, File } from 'lucide-react';


interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
    { name: 'Contacts', icon: <Users size={18} />, path: '/contacts' },
    { name: 'Leads', icon: <UserCheck size={18} />, path: '/leads' },
    { name: 'User', icon: <User size={18} />, path: '/user' },
    { name: 'Tasks', icon: <File size={18} />, path: '/task' },
  ];

  return (
    <aside
      className={`bg-sidebar transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-sidebar-primary font-bold text-xl tracking-wider">CRMS</h2>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sidebar-foreground rounded-md transition-colors ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
