import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Store } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [location, setLocation] = useState<string>("your area");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const area = data.address?.suburb || data.address?.neighbourhood || data.address?.city || "your area";
            setLocation(area);
          } catch {
            setLocation("your area");
          }
        },
        () => {
          setLocation("your area");
        }
      );
    }
  }, []);

  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary rounded-full">
              <Clock className="w-4 h-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-foreground">Delivery in minutes, not days</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Fashion at your
              <span className="block text-secondary"> doorstep.</span>
              <span className="block">Now.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Access live inventory from brand stores near you. Buy what's actually in stock. 
              Get it delivered in minutes—not days.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6" asChild>
                <Link to="/browse">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                Partner with us
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Brand Stores</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">15 min</p>
                <p className="text-sm text-muted-foreground">Avg. Delivery</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Shoppers</p>
              </div>
            </div>
          </div>

          <div className="relative">
              <div className="relative z-10">
              <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-muted-foreground">Stores near {location}</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "Zara", distance: "0.8 km", time: "12 min", items: 234 },
                    { name: "H&M", distance: "1.2 km", time: "15 min", items: 189 },
                    { name: "Mango", distance: "1.5 km", time: "18 min", items: 156 },
                  ].map((store, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                          <Store className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{store.name}</p>
                          <p className="text-sm text-muted-foreground">{store.items} items available</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{store.time}</p>
                        <p className="text-sm text-muted-foreground">{store.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-full h-full bg-secondary/20 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-secondary rounded-2xl -z-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
