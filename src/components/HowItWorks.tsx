import { MapPin, Search, ShoppingBag, Truck } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Share your location",
    description: "We find brand stores within 5km that can deliver to you instantly.",
  },
  {
    icon: Search,
    title: "Browse live inventory",
    description: "See what's actually in stock right now—no 'out of stock' surprises.",
  },
  {
    icon: ShoppingBag,
    title: "Shop your style",
    description: "Pick from real inventory across multiple brand stores in one cart.",
  },
  {
    icon: Truck,
    title: "Get it in minutes",
    description: "Our delivery partners pick up from store and bring it to your door.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-secondary-foreground bg-secondary/20 px-4 py-2 rounded-full">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-6 text-foreground">
            From store shelf to your wardrobe
          </h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            No warehouse. No days of waiting. Just real clothes from real stores, delivered fast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-background border-2 border-border rounded-2xl p-8 h-full hover:border-secondary transition-colors group">
                <div className="w-16 h-16 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                  <step.icon className="w-8 h-8 text-secondary-foreground group-hover:text-secondary-foreground" />
                </div>
                <span className="text-6xl font-bold text-muted/50 absolute top-4 right-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
