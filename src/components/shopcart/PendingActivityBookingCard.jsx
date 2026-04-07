import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, Clock, Phone, Trash2, Edit, Eye } from "lucide-react";
import ActivityEditModal from "@/components/activities/ActivityEditModal";
import { updatePendingActivityBooking } from "@/store/slices/cartSlice";

const getPaymentMethodLabel = (method) => {
  const methods = {
    cash: "Pay on Arrival",
    card: "Card Payment"
  };
  return methods[method] || method;
};

export default function PendingActivityBookingCard({ booking, onRemove }) {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const calculateTotal = () => {
    return (booking.price || 0) * (booking.guests || 1);
  };

  const handleEditBooking = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveBooking = (updatedBooking) => {
    dispatch(updatePendingActivityBooking({
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
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg font-semibold">
                {booking.activityTitle || "Activity Booking"}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit">
              Activity
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
            <span>{booking.scheduleDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{booking.startTime} - {booking.endTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{booking.guests} guests</span>
          </div>
        </div>

        {/* Contact Phone */}
        {booking.contactPhone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{booking.contactPhone}</span>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="text-sm">
            <span className="font-medium">Notes:</span>
            <p className="text-muted-foreground mt-1">{booking.notes}</p>
          </div>
        )}

        {/* Price Calculation */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Price per person:</span>
            <span>${booking.price?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Number of guests:</span>
            <span>{booking.guests}</span>
          </div>
        </div>

        {/* Payment Method and Total */}
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
      <ActivityEditModal
        isOpen={isEditModalOpen}
        booking={booking}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleSaveBooking}
      />
    </Card>
  );
}
