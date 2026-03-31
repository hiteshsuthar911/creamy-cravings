import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function Invoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${id}/invoice`);
        if (!res.ok) {
          throw new Error('Invoice not found or failed to load.');
        }
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-cream">
        <p className="text-dark-chocolate/60">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center bg-cream">
        <p className="text-red-500 mb-4">{error || 'Invoice not found.'}</p>
        <Link to="/" className="btn-secondary">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream print:pt-0 print:bg-white">
      <div className="container-custom max-w-3xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-dark-chocolate/60 hover:text-caramel transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
            <Printer className="w-5 h-5" /> Print Invoice
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-caramel/20 p-8 md:p-12 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-caramel/20 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🍰</span>
                <h1 className="font-display text-2xl font-bold text-dark-chocolate leading-tight">
                  Creamy Cravings<br/>
                  <span className="text-sm font-accent italic text-chocolate/70">Cheesecake Works</span>
                </h1>
              </div>
              <p className="text-dark-chocolate/60 text-sm">
                123 Bakery Lane<br />
                Sweet City, SC 12345<br />
                contact@creamycravings.com
              </p>
            </div>
            <div className="mt-8 md:mt-0 text-left md:text-right">
              <h2 className="font-display text-3xl font-bold text-caramel mb-2 uppercase tracking-wide">Invoice</h2>
              <p className="font-semibold text-dark-chocolate">#{invoice.invoiceNumber || invoice.orderNumber}</p>
              <p className="text-sm text-dark-chocolate/60 mt-1">
                Date: {new Date(invoice.invoiceGeneratedAt || invoice.orderCreatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-xs font-semibold uppercase text-caramel tracking-wider mb-2">Billed To</p>
              <h3 className="font-bold text-dark-chocolate text-lg">{invoice.customer?.name}</h3>
              <p className="text-dark-chocolate/70 mt-1">{invoice.customer?.phone}</p>
              {invoice.customer?.email && (
                <p className="text-dark-chocolate/70">{invoice.customer.email}</p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase text-caramel tracking-wider mb-2">Order Info</p>
              <p className="text-dark-chocolate/70 mt-1"><span className="font-medium text-dark-chocolate">Order #:</span> {invoice.orderNumber}</p>
              <p className="text-dark-chocolate/70"><span className="font-medium text-dark-chocolate">Pickup Date:</span> {new Date(invoice.pickup?.date).toLocaleDateString()}</p>
              <p className="text-dark-chocolate/70"><span className="font-medium text-dark-chocolate">Pickup Time:</span> {invoice.pickup?.time}</p>
            </div>
          </div>

          <div className="mb-12">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-caramel/20">
                  <th className="py-3 font-semibold text-dark-chocolate w-3/5">Item</th>
                  <th className="py-3 font-semibold text-dark-chocolate text-center">Qty</th>
                  <th className="py-3 font-semibold text-dark-chocolate text-right">Unit Price</th>
                  <th className="py-3 font-semibold text-dark-chocolate text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item, index) => (
                  <tr key={index} className="border-b border-caramel/10">
                    <td className="py-4 text-dark-chocolate/80">{item.name}</td>
                    <td className="py-4 text-dark-chocolate/80 text-center">{item.quantity}</td>
                    <td className="py-4 text-dark-chocolate/80 text-right">${(item.unitPrice || 0).toFixed(2)}</td>
                    <td className="py-4 font-medium text-dark-chocolate text-right">${(item.lineTotal || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <div className="flex justify-between py-2 text-dark-chocolate/80 border-b border-caramel/10">
                <span>Subtotal</span>
                <span>${(invoice.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-dark-chocolate/80 border-b border-caramel/20 mb-2">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between py-3 font-display font-bold text-xl text-caramel">
                <span>Total</span>
                <span>${(invoice.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-12 p-4 bg-caramel/5 rounded-xl border border-caramel/20 print:border-none print:px-0 print:bg-transparent">
              <p className="text-xs font-semibold uppercase text-caramel tracking-wider mb-2">Order Notes</p>
              <p className="text-dark-chocolate/80">{invoice.notes}</p>
            </div>
          )}

          <div className="mt-16 text-center text-dark-chocolate/40 text-sm">
            <p>Thank you for choosing Creamy Cravings!</p>
            <p>Please bring this invoice when picking up your order.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
