import { useState } from 'react';
import { Package, Home, Users, Truck, Settings, BarChart3, HelpCircle, LogOut, Warehouse, ClipboardList, ChevronDown, ChevronRight } from 'lucide-react';

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
    { 
      key: 'rules', 
      label: '规则设置', 
      icon: ClipboardList,
      children: [
        { key: 'stockAgeAlert', label: '货物货龄提醒', icon: ClipboardList },
      ]
    },
    { key: 'settings', label: '系统设置', icon: Settings },
    { key: 'help', label: '帮助中心', icon: HelpCircle },
  ];

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const getMenuLabel = (key: string) => {
    // 先检查是否是子菜单
    for (const item of menuItems) {
      if (item.children) {
        const child = item.children.find(c => c.key === key);
        if (child) return child.label;
      }
    }
    // 检查是否是主菜单
    const item = menuItems.find(i => i.key === key);
    return item ? item.label : '';
  };

  const isChildActive = (children?: { key: string }[]) => {
    return children?.some(child => child.key === activeMenu);
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
          {menuItems.map(item => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.key);
            const childIsActive = isChildActive(item.children);

            return (
              <div key={item.key}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item.key);
                    } else {
                      onMenuChange?.(item.key);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    activeMenu === item.key || childIsActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-200 hover:bg-primary-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {hasChildren && (
                    isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {hasChildren && isExpanded && (
                  <div className="bg-primary-800">
                    {item.children!.map(child => (
                      <button
                        key={child.key}
                        onClick={() => onMenuChange?.(child.key)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 pl-12 transition-colors ${
                          activeMenu === child.key
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-300 hover:bg-primary-700'
                        }`}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
