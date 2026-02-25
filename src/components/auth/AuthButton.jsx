import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function AuthButton({
  isSubmitting,
  children,
  loadingText = "please wait...",
}) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-secondary transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
    >
      {isSubmitting ? (
        <>
          {loadingText}
          <Loader2 className="h-4 w-4 animate-spin" />
        </>
      ) : (
        children || "Submit"
      )}
    </Button>
  );
}
