/*
  # Seed Sample Travel Bookings
  
  Inserts sample travel booking data for testing the Travel Management System.
  Includes various destinations with different statuses and prices.
*/

INSERT INTO bookings (user_id, destination, booking_date, travel_date, price, status, notes)
VALUES
  ('8d27bab3-d2dd-4795-aef9-1abfd6a80bc2', 'Paris, France', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 1299.99, 'confirmed', 'Summer vacation - 5 days in Paris'),
  ('8d27bab3-d2dd-4795-aef9-1abfd6a80bc2', 'Tokyo, Japan', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 2499.99, 'pending', 'Business trip - 7 days including conferences'),
  ('8d27bab3-d2dd-4795-aef9-1abfd6a80bc2', 'New York, USA', CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 899.99, 'confirmed', 'Weekend getaway - 3 days in NYC'),
  ('8d27bab3-d2dd-4795-aef9-1abfd6a80bc2', 'Barcelona, Spain', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 1599.99, 'pending', 'Beach and culture - 6 days'),
  ('8d27bab3-d2dd-4795-aef9-1abfd6a80bc2', 'Dubai, UAE', CURRENT_DATE, CURRENT_DATE + INTERVAL '15 days', 1899.99, 'confirmed', 'Luxury resort stay - 4 days');
