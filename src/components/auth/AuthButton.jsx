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
      variant="palmPrimary"
      size="default"
      disabled={isSubmitting}
      className="w-full md:h-12 rounded-md"
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
