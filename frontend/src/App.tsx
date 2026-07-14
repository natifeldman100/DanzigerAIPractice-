import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CustomersPage from './pages/CustomersPage'
import { FlowerVarietiesPage } from './pages/FlowerVarietiesPage'
import SuppliersPage from './pages/SuppliersPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="flower-varieties" element={<FlowerVarietiesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
