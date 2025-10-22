import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Coffee, Waves, Car } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  image_url: string;
  description: string;
  price_per_night: number;
  rating: number;
  amenities: string[];
}

interface HotelDialogProps {
  hotel: Hotel | null;
  open: boolean;
  onClose: () => void;
  onBook: (hotel: Hotel) => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  pool: Waves,
  parking: Car,
  breakfast: Coffee,
};

export function HotelDialog({ hotel, open, onClose, onBook }: HotelDialogProps) {
  if (!hotel) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hotel.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hotel Image */}
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={hotel.image_url}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{hotel.rating}</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${hotel.price_per_night}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
          </div>

          {/* Description */}
          {hotel.description && (
            <div>
              <h3 className="font-semibold mb-2">About this property</h3>
              <p className="text-muted-foreground">{hotel.description}</p>
            </div>
          )}

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {hotel.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity.toLowerCase()] || MapPin;
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm capitalize">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Book Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              onBook(hotel);
              onClose();
            }}
          >
            Select This Hotel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
