import { Zap, Shield, RefreshCw, Heart, Layers, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time Inventory",
    description: "See exactly what's available in stores right now. No surprises, no disappointments.",
  },
  {
    icon: Shield,
    title: "Authentic Products",
    description: "Every item comes directly from authorized brand stores. 100% genuine, always.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Changed your mind? We'll pick it up and return it to the store for you.",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Wishlist items across stores. Get notified when they're available nearby.",
  },
  {
    icon: Layers,
    title: "Multi-store Cart",
    description: "Shop from multiple stores in one order. We handle the logistics.",
  },
  {
    icon: Globe,
    title: "Hyperlocal Focus",
    description: "Supporting local retail. Better for stores, faster for you.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-full">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-6">
            Why shoppers love ZipIn
          </h2>
          <p className="text-xl opacity-80 mt-4 max-w-2xl mx-auto">
            We're not just another delivery app. We're reimagining how fashion retail works.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-primary-foreground/20 rounded-2xl p-8 hover:bg-primary-foreground/5 transition-colors"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="opacity-70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
