'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VendorWalletPage() {
  const [balance] = useState(45750);
  const [transactions] = useState([
    {
      id: 1,
      type: 'credit',
      amount: 2500,
      description: 'Order payment - ORD-001',
      date: '2024-01-20',
      balance: 45750,
    },
    {
      id: 2,
      type: 'debit',
      amount: 500,
      description: 'Withdrawal to bank',
      date: '2024-01-19',
      balance: 43250,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
        <Link href="/vendor/dashboard" className="text-2xl font-bold mb-8 block">
          Vendor Portal
        </Link>
        <nav className="space-y-2">
          <Link href="/vendor/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800">
            Dashboard
          </Link>
          <Link href="/vendor/products" className="block px-4 py-2 rounded hover:bg-gray-800">
            My Products
          </Link>
          <Link href="/vendor/orders" className="block px-4 py-2 rounded hover:bg-gray-800">
            Orders
          </Link>
          <Link href="/vendor/rfq" className="block px-4 py-2 rounded hover:bg-gray-800">
            RFQ & Quotations
          </Link>
          <Link href="/vendor/wallet" className="block px-4 py-2 rounded bg-gray-800">
            Wallet
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wallet</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-90 mb-2">Available Balance</div>
              <div className="text-5xl font-bold">₹{balance.toLocaleString()}</div>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold">
              Withdraw to Bank
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Earnings</div>
            <div className="text-3xl font-bold text-green-600 mt-2">₹84,500</div>
            <div className="text-sm text-gray-500 mt-1">This month</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Pending Clearance</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">₹12,300</div>
            <div className="text-sm text-gray-500 mt-1">5 orders</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Withdrawals</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">₹65,200</div>
            <div className="text-sm text-gray-500 mt-1">All time</div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">All Transactions</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.type === 'credit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">₹{tx.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-lg shadow mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Bank Account Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Account Holder Name</label>
              <div className="font-medium mt-1">John Doe Business</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Account Number</label>
              <div className="font-medium mt-1">****8765</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Bank Name</label>
              <div className="font-medium mt-1">HDFC Bank</div>
            </div>
            <div>
              <label className="text-sm text-gray-600">IFSC Code</label>
              <div className="font-medium mt-1">HDFC0001234</div>
            </div>
          </div>
          <button className="mt-4 text-blue-600 hover:text-blue-700">
            Update Bank Details
          </button>
        </div>
      </main>
    </div>
  );
}
