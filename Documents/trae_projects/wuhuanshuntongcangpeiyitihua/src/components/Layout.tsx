import { Package, Home, Users, Truck, Settings, BarChart3, HelpCircle, LogOut, Warehouse } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  onMenuChange?: (key: string) => void;
}

export const Layout = ({ children, activeMenu, onMenuChange }: LayoutProps) => {
  const menuItems = [
    { key: 'home', label: '首页', icon: Home },
    { key: 'goods', label: '货物管理', icon: Package },
    { key: 'store', label: '仓库管理', icon: Warehouse },
    { key: 'customer', label: '客户管理', icon: Users },
    { key: 'vehicle', label: '车辆管理', icon: Truck },
    { key: 'report', label: '统计报表', icon: BarChart3 },
    { key: 'settings', label: '系统设置', icon: Settings },
    { key: 'help', label: '帮助中心', icon: HelpCircle },
  ];

  const getMenuLabel = (key: string) => {
    const item = menuItems.find(i => i.key === key);
    return item ? item.label : '';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-primary-600 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-primary-700">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8" />
            <span className="text-xl font-bold">五环运通</span>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <button
              key={item.key}
              onClick={() => onMenuChange?.(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeMenu === item.key
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-200 hover:bg-primary-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-primary-700">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-primary-700 rounded transition-colors">
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">{getMenuLabel(activeMenu)}</h1>
            <span className="text-sm text-gray-500">基础信息管理</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">五环运通管理员</span>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
              管
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
