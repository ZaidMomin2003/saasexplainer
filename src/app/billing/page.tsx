"use client";

import React from "react";
import { DashboardNav } from "@/components/DashboardNav";
import { CreditCard, Download, CheckCircle2 } from "lucide-react";

export default function BillingPage() {
  const invoices = [
    { id: "INV-2026-03-24", amount: "$15.00", status: "Paid", date: "Mar 24, 2026" },
    { id: "INV-2026-03-12", amount: "$15.00", status: "Paid", date: "Mar 12, 2026" },
    { id: "INV-2026-02-28", amount: "$15.00", status: "Paid", date: "Feb 28, 2026" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-inter selection:bg-rose-100 selection:text-rose-900">
      <DashboardNav />

      <main className="max-w-4xl mx-auto px-6 py-12 pb-24">
        <header className="mb-10 block">
          <h1 className="text-3xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight mb-2">
            Billing & Invoices
          </h1>
          <p className="text-gray-500 font-medium">Manage your payment methods and export history.</p>
        </header>

        <div className="space-y-8">
          
          {/* Current Plan */}
          <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-xs font-bold text-rose-700 mb-3 tracking-tight">
                Current Plan
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 font-[var(--font-outfit)]">Free Tier</h2>
              <p className="text-sm font-medium text-gray-500 max-w-sm">
                You are currently on the free tier. You only pay a flat $10 export fee per video. No hidden subscriptions.
              </p>
            </div>
            
            <div className="w-full md:w-auto p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-3 min-w-[280px]">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                  <CreditCard size={16} /> Payment Method
                </span>
                <span className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer">Update</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-6 bg-gray-900 rounded flex items-center justify-center text-[10px] text-white font-black italic shadow-inner">VISA</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 leading-none">•••• 4242</span>
                  <span className="text-[11px] font-medium text-gray-500">Expires 12/28</span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment History Table */}
          <section className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-100 pb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 font-[var(--font-outfit)]">Payment History</h2>
                <p className="text-sm font-medium text-gray-500">View and download your past export invoices.</p>
              </div>
              <button className="px-5 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm font-bold shadow-sm hover:bg-gray-100 hover:border-gray-300 transition-all active:scale-95 flex items-center gap-2">
                <Download size={14} />
                Export All
              </button>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-gray-600 font-medium">
                <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th scope="col" className="px-8 py-4 border-b border-gray-100">Invoice</th>
                    <th scope="col" className="px-8 py-4 border-b border-gray-100">Date</th>
                    <th scope="col" className="px-8 py-4 border-b border-gray-100">Amount</th>
                    <th scope="col" className="px-8 py-4 border-b border-gray-100">Status</th>
                    <th scope="col" className="px-8 py-4 border-b border-gray-100 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap font-bold text-gray-900">{inv.id}</td>
                      <td className="px-8 py-5 whitespace-nowrap">{inv.date}</td>
                      <td className="px-8 py-5 whitespace-nowrap font-bold text-gray-800">{inv.amount}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 size={12} /> {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <a href="#" className="font-bold text-rose-600 hover:text-rose-800 transition-colors">Download PDF</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
