import DashboardTop from '@/components/DashboardTop'
import Navbar from '@/components/Navbar'
import React from 'react'

const Dashboard = () => {
    return (
        <div className="flex h-full">
            <Navbar />
            <div className="grow p-10">
                <DashboardTop />
                <h1>Dashboard</h1>
            </div>
            
        </div>
    )
}

export default Dashboard