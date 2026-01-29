import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded-lg">
            <Zap className="w-6 h-6 text-secondary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">ZipIn</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#for-stores" className="text-muted-foreground hover:text-foreground transition-colors">
            For Stores
          </a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
