import React, { useEffect, useState } from "react";
import DeashboardLayout from "../layout/DeashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import jsPDF from "jspdf";
import apiEndpoints from "../context/apiEndpoint";

export default function Transaction() {
  const { getToken } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await getToken();
        const res = await fetch(apiEndpoints.TRANSACTION, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
          console.log("Transactions fetched:", data);
        } else {
          console.error("Failed to fetch transactions");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, [getToken]);

  // ✅ Generate PDF receipt for a specific transaction
  const handleDownloadReceipt = (tx) => {
    try {
      const doc = new jsPDF();

      // Company Header
      doc.setFontSize(22);
      doc.text("Cloud Share", 105, 20, { align: "center" });
      doc.setFontSize(14);
      doc.text("Payment Receipt", 105, 30, { align: "center" });

      doc.line(20, 35, 190, 35); // horizontal line

      // Customer Info
      doc.setFontSize(12);
      doc.text(`Customer: ${tx.username || "N/A"}`, 20, 50);
      doc.text(`Email: ${tx.userEmail || "N/A"}`, 20, 60);
      doc.text(
        `Date: ${new Date(tx.transactionDate).toLocaleString()}`,
        20,
        70
      );

      // Transaction Details Section
      doc.setFontSize(12);
      doc.text("Transaction Details:", 20, 90);

      const details = [
        ["Receipt ID", tx.id],
        ["Payment ID", tx.paymentId],
        ["Order ID", tx.orderId],
        ["Plan", tx.planId],
        ["Amount", `${tx.amount} ${tx.currency}`],
        ["Credits Added", String(tx.creditsAdded)],
        ["Status", tx.status],
      ];

      let y = 100;
      details.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, y);
        doc.text(String(value || "N/A"), 80, y);
        y += 10;
      });

      // Footer
      doc.setFontSize(10);
      doc.text(
        "Thank you for using Cloud Share!",
        105,
        y + 20,
        { align: "center" }
      );

      // Save the file
      doc.save(`receipt-${tx.id}.pdf`);
      console.log("Receipt generated for transaction:", tx.id);
    } catch (err) {
      console.error("Error generating receipt:", err);
    }
  };

  return (
    <DeashboardLayout activeMenu="transaction">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>

        <div className="bg-white rounded-2xl shadow border overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-3">
                      {new Date(tx.transactionDate).toLocaleString()}
                    </td>
                    <td className="p-3">
                      ₹{tx.amount} {tx.currency}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : tx.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDownloadReceipt(tx)}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Download Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-3 text-center text-gray-500 text-sm"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DeashboardLayout>
  );
}
