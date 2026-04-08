import { Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function RoomErrorState({ error }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-destructive">Error</h2>
      <p className="mb-6 text-muted-foreground">{error}</p>
      <Button onClick={() => navigate("/rooms")}>Back to Rooms</Button>
    </div>
  );
}

export function RoomNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Ban className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">Room Not Found</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        We couldn't find the room you're looking for. It may have been removed or the link is invalid.
      </p>
      <Button onClick={() => navigate("/rooms")} className="bg-primary text-primary-foreground hover:bg-primary/90">
        Back to All Rooms
      </Button>
    </div>
  );
}
