import { useState } from 'react';
import { Layout } from './components/Layout';
import { GoodsList } from './pages/GoodsList';
import { StoreList } from './pages/StoreList';
import { StockAgeAlertList } from './pages/StockAgeAlertList';

function App() {
  const [activeMenu, setActiveMenu] = useState('goods');

  const renderContent = () => {
    switch (activeMenu) {
      case 'stockAgeAlert':
        return <StockAgeAlertList />;
      case 'store':
        return <StoreList />;
      case 'goods':
      default:
        return <GoodsList />;
    }
  };

  return (
    <Layout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      {renderContent()}
    </Layout>
  );
}

export default App
