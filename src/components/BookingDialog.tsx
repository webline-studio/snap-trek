import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingDialogProps {
  tripName: string;
  destination: string;
  basePrice: number;
  open: boolean;
  onClose: () => void;
  selectedHotel?: { name: string; price_per_night: number } | null;
}

export function BookingDialog({
  tripName,
  destination,
  basePrice,
  open,
  onClose,
  selectedHotel,
}: BookingDialogProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    let total = basePrice;
    if (selectedHotel && startDate && endDate) {
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      total += selectedHotel.price_per_night * days;
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        trip_name: tripName,
        destination: destination,
        start_date: startDate,
        end_date: endDate,
        guests: guests,
        total_price: calculateTotal(),
        hotel_name: selectedHotel?.name || null,
        status: "confirmed",
      });

      if (error) throw error;

      toast.success("Booking confirmed! 🎉", {
        description: "Check your profile for booking details.",
      });
      onClose();
    } catch (error: any) {
      toast.error("Booking failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{tripName}</h3>
            <p className="text-sm text-muted-foreground">{destination}</p>
            {selectedHotel && (
              <p className="text-sm text-primary mt-1">Hotel: {selectedHotel.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="guests"
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total Price:</span>
              <span className="text-2xl font-bold text-primary">
                ${calculateTotal().toLocaleString()}
              </span>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
