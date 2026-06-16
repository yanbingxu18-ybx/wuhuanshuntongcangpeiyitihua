import { Layout } from './components/Layout'
import { GoodsList } from './pages/GoodsList'

function App() {
  return (
    <Layout activeMenu="goods">
      <GoodsList />
    </Layout>
  )
}

export default App
