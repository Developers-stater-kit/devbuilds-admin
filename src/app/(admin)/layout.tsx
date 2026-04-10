import React from 'react'
import AdminCheck from './check'

export default async function layout({ children }: { children: React.ReactNode }) {
    return (
        <AdminCheck>
            {children}
        </AdminCheck>
    )
}
