import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/products/ProductList'
import ProductForm from './pages/products/ProductForm'
import ProductDetail from './pages/products/ProductDetail'
import Categories from './pages/categories/Categories'
import OrderList from './pages/orders/OrderList'
import OrderDetail from './pages/orders/OrderDetail'
import InventoryDashboard from './pages/inventory/InventoryDashboard'
import Reports from './pages/reports/Reports'
import Profile from './pages/settings/Profile'
import Business from './pages/settings/Business'
import Users from './pages/settings/Users'
import Login from './pages/Login'
import Blocked from './pages/Blocked'
import { useEffect, useState } from 'react'
import { getMyVendor } from './api/vendors'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = (() => {
    try { return localStorage.getItem('accessToken') } catch { return null }
  })()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function VendorStatusGate({ children }: { children: JSX.Element }) {
  const [ok, setOk] = useState<boolean | null>(null)
  const [reason, setReason] = useState<string>('')

  useEffect(() => {
    (async () => {
      const v = await getMyVendor()
      if (!v) {
        setOk(false)
        setReason('Vendor account not found or deleted')
        return
      }
      if ((v as any).status !== 'active') {
        setOk(false)
        setReason(`Vendor status is ${v.status}`)
        return
      }
      setOk(true)
    })()
  }, [])

  if (ok === null) return null
  if (!ok) return <Navigate to="/blocked" replace state={{ reason }} />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/blocked" element={<Blocked />} />
      <Route element={<RequireAuth><VendorStatusGate><Layout /></VendorStatusGate></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="inventory" element={<InventoryDashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings">
          <Route path="profile" element={<Profile />} />
          <Route path="business" element={<Business />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
