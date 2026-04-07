import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Users, Calendar, Clock, Trash2, Edit, Eye } from "lucide-react";
import RestaurantEditModal from "@/components/restaurant/RestaurantEditModal";
import { updatePendingRestaurantBooking } from "@/store/slices/cartSlice";

const getBookingModeLabel = (mode) => {
  const modes = {
    table_only: "Table Only",
    dine_in: "Dine In",
    room_service: "Room Service"
  };
  return modes[mode] || mode;
};

const getPaymentMethodLabel = (method) => {
  const methods = {
    cash: "Pay on Arrival",
    stripe: "Card Payment"
  };
  return methods[method] || method;
};

export default function PendingRestaurantBookingCard({ booking, onRemove }) {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const calculateTotal = () => {
    if (!booking.lineItems || booking.lineItems.length === 0) return 0;
    return booking.lineItems.reduce((sum, item) => {
      return sum + (item.price * item.qty);
    }, 0);
  };

  const handleEditBooking = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveBooking = (updatedBooking) => {
    dispatch(updatePendingRestaurantBooking({
      id: booking.id,
      updates: updatedBooking
    }));
    setIsEditModalOpen(false);
  };

  return (
    <Card className="overflow-hidden border border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg font-semibold">
                Restaurant Booking
              </CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit">
              {getBookingModeLabel(booking.bookingMode)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Edit Booking"
              onClick={handleEditBooking}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={onRemove}
              title="Remove from Cart"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{booking.guests} guests</span>
          </div>
        </div>

        {/* Table/Room Info */}
        {booking.bookingMode === "room_service" && booking.roomNumber && (
          <div className="text-sm">
            <span className="font-medium">Room:</span> {booking.roomNumber}
          </div>
        )}
        
        {(booking.bookingMode === "table_only" || booking.bookingMode === "dine_in") && booking.number && (
          <div className="text-sm">
            <span className="font-medium">Table:</span> {booking.number}
          </div>
        )}

        {/* Food Items */}
        {booking.lineItems && booking.lineItems.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Food Items:</div>
            <div className="space-y-1">
              {booking.lineItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name || `Item ${index + 1}`}</span>
                  <span className="text-muted-foreground">
                    {item.qty} × ${item.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm">
            <span className="font-medium">Payment:</span> {getPaymentMethodLabel(booking.paymentMethod)}
          </div>
          <div className="text-lg font-bold text-primary">
            ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </CardContent>
      
      {/* Edit Modal */}
      <RestaurantEditModal
        isOpen={isEditModalOpen}
        booking={booking}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleSaveBooking}
      />
    </Card>
  );
}
