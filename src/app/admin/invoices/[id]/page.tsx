"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Printer, Download, CheckCircle, Dumbbell } from "lucide-react";

export default function InvoiceViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/invoices/${id}`)
        .then((res) => res.json())
        .then((data) => setInvoice(data.invoice))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <p className="text-neutral-400">Invoice not found.</p>
        <Link href="/admin/payments" className="mt-4">
          <Button variant="outline">Back to Payments</Button>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4">
      {/* Action Header (hidden in print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={14} />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Invoice Document Box */}
      <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8 md:p-12 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-neutral-800 print:border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-extrabold text-xl">
                FF
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                FITFLOW FITNESS
              </h1>
            </div>
            <p className="text-xs text-neutral-400 print:text-neutral-600 mt-2">
              Official Tax Invoice & Receipt
            </p>
            <p className="text-xs text-neutral-400 print:text-neutral-600">
              Plot 42, HSR Layout, Sector 2, Bengaluru, Karnataka 560102
            </p>
            <p className="text-xs text-neutral-400 print:text-neutral-600">
              GSTIN: 29AAAAA0000A1Z5 | contact@fitflowfitness.com
            </p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/80 text-xs font-bold uppercase print:border-emerald-600 print:text-emerald-700">
              Paid in Full
            </span>
            <h2 className="text-lg font-bold text-white print:text-black mt-2 font-mono">
              {invoice.invoiceNumber}
            </h2>
            <p className="text-xs text-neutral-400 print:text-neutral-600 mt-1">
              Issue Date: {formatDate(invoice.issueDate)}
            </p>
          </div>
        </div>

        {/* Billed To / Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-neutral-800 print:border-neutral-200">
          <div>
            <p className="text-xs font-semibold text-neutral-400 print:text-neutral-500 uppercase tracking-wider mb-2">
              Billed To (Member)
            </p>
            <h3 className="text-base font-bold text-white print:text-black">
              {invoice.member?.name}
            </h3>
            <p className="text-xs text-neutral-300 print:text-neutral-700 mt-0.5">
              Email: {invoice.member?.email}
            </p>
            <p className="text-xs text-neutral-300 print:text-neutral-700 mt-0.5">
              Phone: {invoice.member?.phone}
            </p>
            <p className="text-xs text-neutral-300 print:text-neutral-700 mt-0.5">
              Address: {invoice.member?.address || "Bengaluru, India"}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-semibold text-neutral-400 print:text-neutral-500 uppercase tracking-wider mb-2">
              Payment Information
            </p>
            <p className="text-xs text-neutral-300 print:text-neutral-700">
              Txn ID:{" "}
              <strong className="font-mono text-white print:text-black">
                {invoice.payment?.transactionId}
              </strong>
            </p>
            <p className="text-xs text-neutral-300 print:text-neutral-700 mt-1">
              Payment Method:{" "}
              <strong className="text-white print:text-black">
                {invoice.payment?.method}
              </strong>
            </p>
            <p className="text-xs text-neutral-300 print:text-neutral-700 mt-1">
              Payment Date: {formatDate(invoice.payment?.date)}
            </p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="py-8 border-b border-neutral-800 print:border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="text-neutral-400 print:text-neutral-600 uppercase border-b border-neutral-800 print:border-neutral-300">
              <tr>
                <th className="py-3">Description</th>
                <th className="py-3 text-center">Duration</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40 print:divide-neutral-200">
              <tr>
                <td className="py-4">
                  <p className="font-bold text-white print:text-black text-sm">
                    FitFlow Membership — {invoice.payment?.plan?.name || "Standard Tier"}
                  </p>
                  <p className="text-neutral-400 print:text-neutral-600 mt-0.5">
                    Unrestricted access to gym floor, strength equipment, locker rooms, and member facilities
                  </p>
                </td>
                <td className="py-4 text-center text-neutral-300 print:text-neutral-800">
                  {invoice.payment?.plan?.duration || 30} Days
                </td>
                <td className="py-4 text-right font-bold text-white print:text-black text-sm">
                  {formatCurrency(invoice.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Calculations */}
        <div className="pt-6 flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400 print:text-neutral-600">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between text-neutral-400 print:text-neutral-600">
              <span>GST (Included)</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between py-2 border-t border-neutral-800 print:border-neutral-300 text-sm font-black text-white print:text-black">
              <span>Total Paid</span>
              <span className="text-emerald-400 print:text-emerald-700">
                {formatCurrency(invoice.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="mt-12 pt-6 border-t border-neutral-800 print:border-neutral-200 text-center text-[11px] text-neutral-500 print:text-neutral-600 space-y-1">
          <p className="font-semibold text-neutral-400 print:text-neutral-700">
            Thank you for being part of the FitFlow Fitness family!
          </p>
          <p>
            For any billing queries or membership amendments, please contact our help desk at +91 98765 43210.
          </p>
          <p className="text-[10px]">This is a computer-generated invoice and does not require a physical signature.</p>
        </div>
      </div>
    </div>
  );
}
