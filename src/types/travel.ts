export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  location: Location;
  tags: string[];
  likes: number;
  comments: number;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  duration: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  country: string;
  lat: number;
  lng: number;
  thumbnail: string;
}

export interface TravelPackage {
  id: string;
  locationId: string;
  title: string;
  days: number;
  price: number;
  currency: string;
  seats: number;
  highlights: string[];
  itinerary: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}
