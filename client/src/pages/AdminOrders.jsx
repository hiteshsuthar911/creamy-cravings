import { useEffect, useMemo, useState } from 'react';
import AdminNav from '../components/admin/AdminNav';
import RequireAdmin from '../components/admin/RequireAdmin';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const statusOptions = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];

export default function AdminOrders() {
  return (
    <RequireAdmin>
      <AdminOrdersInner />
    </RequireAdmin>
  );
}

function AdminOrdersInner() {
  const token = localStorage.getItem('creamy-cravings-admin-token');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [viewingOrder, setViewingOrder] = useState(null);

  const authHeaders = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [token]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to load orders');
      }
      const data = await res.json();
      setOrders(data);
      const nextSelected = {};
      data.forEach((o) => (nextSelected[o._id] = o.status));
      setSelectedStatus(nextSelected);
    } catch (err) {
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId) => {
    const status = selectedStatus[orderId];
    if (!status) return;
    setUpdatingId(orderId);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update status');
      }
      await fetchOrders();
    } catch (err) {
      setError(err?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPickupDate = (d) => {
    try {
      if (!d) return '—';
      return new Date(d).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom space-y-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-dark-chocolate">
            Admin - Orders
          </h1>
          <p className="text-dark-chocolate/60 mt-2">
            Update order status for pickup readiness.
          </p>
        </div>

        <AdminNav />

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl p-6 animate-pulse">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl p-6 text-dark-chocolate/60">
            No orders yet.
          </div>
        ) : (
          <div className="bg-white/70 dark:bg-white/5 border border-caramel/20 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-caramel/20">
              <h2 className="font-display text-2xl font-semibold text-dark-chocolate">
                Order Queue
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream/80">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Pickup</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-t border-caramel/10 align-top">
                      <td className="p-4 font-medium text-dark-chocolate">
                        {o.customerName}
                        <div className="text-xs text-dark-chocolate/60 mt-1">
                          {o.customerPhone}
                        </div>
                      </td>
                      <td className="p-4 text-dark-chocolate/70">
                        {formatPickupDate(o.pickupDate)}
                        <div className="text-xs text-dark-chocolate/60 mt-1">
                          {o.pickupTime}
                        </div>
                      </td>
                      <td className="p-4 text-dark-chocolate/70">
                        <div className="space-y-1">
                          {(o.items || []).slice(0, 3).map((it) => (
                            <div key={it._id}>
                              {it.product?.name || it.product} x {it.quantity}
                            </div>
                          ))}
                          {(o.items || []).length > 3 && (
                            <div className="text-xs text-dark-chocolate/60">
                              +{(o.items || []).length - 3} more
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={selectedStatus[o._id] || o.status}
                          onChange={(e) =>
                            setSelectedStatus((p) => ({ ...p, [o._id]: e.target.value }))
                          }
                          className="px-3 py-2 bg-cream border border-caramel/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-caramel/50"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-caramel font-semibold">${(o.total ?? 0).toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-1.5 bg-caramel text-white rounded-lg text-sm hover:bg-caramel/90 transition-colors"
                            onClick={() => updateStatus(o._id)}
                            disabled={updatingId === o._id}
                          >
                            {updatingId === o._id ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            className="px-3 py-1.5 bg-white border border-caramel/20 text-dark-chocolate rounded-lg text-sm hover:bg-caramel/10 transition-colors"
                            onClick={() => setViewingOrder(o)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-chocolate/50 backdrop-blur-sm">
            <div className="bg-cream rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-caramel/20">
              <div className="p-6 border-b border-caramel/20 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="font-display text-2xl font-semibold text-dark-chocolate">
                  Order Details
                </h2>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="text-dark-chocolate/60 hover:text-caramel p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-caramel font-semibold uppercase tracking-wider mb-1">Order No.</p>
                    <p className="font-medium text-lg">{viewingOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-caramel font-semibold uppercase tracking-wider mb-1">Status</p>
                    <p className="font-medium text-lg capitalize">{viewingOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-caramel font-semibold uppercase tracking-wider mb-1">Customer</p>
                    <p className="font-medium">{viewingOrder.customerName}</p>
                    <p className="text-sm text-dark-chocolate/70">{viewingOrder.customerPhone}</p>
                    {viewingOrder.customerEmail && <p className="text-sm text-dark-chocolate/70">{viewingOrder.customerEmail}</p>}
                  </div>
                  <div>
                    <p className="text-xs text-caramel font-semibold uppercase tracking-wider mb-1">Pickup</p>
                    <p className="font-medium">{formatPickupDate(viewingOrder.pickupDate)}</p>
                    <p className="text-sm text-dark-chocolate/70">{viewingOrder.pickupTime}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-caramel font-semibold uppercase tracking-wider mb-2">Items</p>
                  <div className="bg-white rounded-xl p-4 border border-caramel/20 space-y-3">
                    {(viewingOrder.items || []).map(it => (
                      <div key={it._id} className="flex justify-between items-center border-b border-caramel/10 pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-dark-chocolate">{it.product?.name || 'Unknown Product'}</p>
                          <p className="text-xs text-dark-chocolate/60 mt-0.5">Qty: {it.quantity} &times; ${(it.product?.price || 0).toFixed(2)}</p>
                        </div>
                        <p className="font-semibold text-caramel text-right">
                          ${((it.product?.price || 0) * it.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between items-center text-lg font-bold border-t border-caramel/20 text-dark-chocolate">
                      <span>Total</span>
                      <span>${(viewingOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {viewingOrder.notes && (
                  <div>
                    <p className="text-xs text-caramel font-semibold uppercase tracking-wider mb-2">Order Notes</p>
                    <p className="bg-white p-4 rounded-xl border border-caramel/20 text-sm text-dark-chocolate/80">{viewingOrder.notes}</p>
                  </div>
                )}
                
                <div className="pt-6 flex justify-end gap-3 border-t border-caramel/20 mt-8">
                   <a 
                      href={`/invoice/${viewingOrder._id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-secondary"
                   >
                      View / Print Invoice
                   </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
