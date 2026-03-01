import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import Sessions from './pages/Sessions'
import Throttled from './pages/Throttled'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import ProtectedRoute from './components/layout/ProtectedRoute'
import SidebarLayout from './components/layout/SidebarLayout'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Dashboard Routes */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <SidebarLayout>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/overview" replace />} />
                                    <Route path="/overview" element={<Overview />} />
                                    <Route path="/customers" element={<Customers />} />
                                    <Route path="/customers/:username" element={<CustomerDetail />} />
                                    <Route path="/sessions" element={<Sessions />} />
                                    <Route path="/throttled" element={<Throttled />} />
                                    <Route path="/billing" element={<Billing />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="*" element={<Navigate to="/overview" replace />} />
                                </Routes>
                            </SidebarLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    )
}

export default App
