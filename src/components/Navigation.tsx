import { Button } from "@/components/ui/button";
import { Heart, Menu, User } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HealthEligible</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Programs
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Help
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button variant="default">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};