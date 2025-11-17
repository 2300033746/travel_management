import { useState, useEffect } from 'react';
import { LogOut, User, Calendar, DollarSign, MapPin, Plus, Edit2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Booking } from '../lib/supabase';
import BookingForm from './BookingForm';
import ProfileEdit from './ProfileEdit';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('travel_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      await loadBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleBookingFormClose = () => {
    setShowBookingForm(false);
    setEditingBooking(null);
    loadBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Travel Manager</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-600">{profile?.email}</p>
                </div>
                <button
                  onClick={() => setShowProfileEdit(true)}
                  className="p-1 hover:bg-blue-100 rounded transition"
                  title="Edit profile"
                >
                  <Edit2 className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{bookings.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmed Trips</p>
                <p className="text-3xl font-bold text-gray-800">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </p>
              </div>
              <MapPin className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">My Bookings</h2>
              <button
                onClick={() => setShowBookingForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Booking</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {booking.destination}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Travel Date: {formatDate(booking.travel_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Booked: {formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-gray-800">
                          ${Number(booking.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showBookingForm && (
        <BookingForm
          booking={editingBooking}
          onClose={handleBookingFormClose}
        />
      )}

      {showProfileEdit && (
        <ProfileEdit onClose={() => setShowProfileEdit(false)} />
      )}
    </div>
  );
}
