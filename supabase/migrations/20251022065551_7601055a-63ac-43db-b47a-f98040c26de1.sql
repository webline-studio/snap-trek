-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trip_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  hotel_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
ON public.bookings
FOR DELETE
USING (auth.uid() = user_id);

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 4.5,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for hotels (public read)
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotels are viewable by everyone"
ON public.hotels
FOR SELECT
USING (true);