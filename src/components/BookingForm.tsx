import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase, Booking } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface BookingFormProps {
  booking?: Booking | null;
  onClose: () => void;
}

export default function BookingForm({ booking, onClose }: BookingFormProps) {
  const { user } = useAuth();
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) {
      setDestination(booking.destination);
      setTravelDate(booking.travel_date);
      setPrice(booking.price.toString());
      setStatus(booking.status);
      setNotes(booking.notes || '');
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const bookingData = {
        user_id: user.id,
        destination,
        travel_date: travelDate,
        price: parseFloat(price),
        status,
        notes,
      };

      if (booking) {
        const { error } = await supabase
          .from('bookings')
          .update(bookingData)
          .eq('id', booking.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookings')
          .insert([bookingData]);

        if (error) throw error;
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save booking');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {booking ? 'Edit Booking' : 'New Booking'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g., Paris, France"
              required
            />
          </div>

          <div>
            <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-2">
              Travel Date
            </label>
            <input
              id="travelDate"
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'confirmed' | 'cancelled')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : booking ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
