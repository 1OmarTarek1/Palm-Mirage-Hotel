import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 transition-colors duration-300">

      <div className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-xl overflow-hidden">

    
        <div className="w-full bg-secondary flex items-center justify-center px-8 pt-14 pb-8">
          <img
            src="https://sailing.thimpress.com/demo-mountain-hotel/wp-content/themes/sailing/assets/images/404.png"
            alt="404 Not Found"
            className="w-full max-w-xs h-auto object-contain opacity-90"
          />
        </div>

        <div className="px-8 md:px-12 py-14 text-center">

          <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-4 block">
            Error 404
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-header">
            Page Not Found
          </h1>

          <p className="text-base text-muted-foreground font-main leading-relaxed mb-10 max-w-xs mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate("/")}>
              <Home size={15} />
              Back to Home
            </Button>
            <Button 
            variant="palmSecondary" 
            onClick={() => navigate(-1)}
            className="rounded-full px-8"
          >
            Go Back
          </Button>
          </div>

        </div>
      </div>

    </div>
  );
}