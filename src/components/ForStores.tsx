import { Button } from "@/components/ui/button";
import { TrendingUp, Package, Smartphone, BarChart3, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Unlock new revenue",
    description: "Turn foot traffic into digital orders without building e-commerce infrastructure.",
  },
  {
    icon: Package,
    title: "Zero inventory risk",
    description: "Sell what you already have. No separate warehouse, no dead stock.",
  },
  {
    icon: Smartphone,
    title: "Simple integration",
    description: "Connect your POS in minutes. We sync your inventory in real-time.",
  },
  {
    icon: BarChart3,
    title: "Data insights",
    description: "Understand local demand patterns and optimize your stock accordingly.",
  },
];

const ForStores = () => {
  return (
    <section id="for-stores" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-medium text-secondary-foreground bg-secondary/20 px-4 py-2 rounded-full">
              For Store Partners
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 text-foreground">
              Your store's digital wardrobe
            </h2>
            <p className="text-xl text-muted-foreground mt-6 mb-10">
              Stop losing customers to online giants. We bring digital shoppers to your physical inventory—
              without the complexity of running e-commerce.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0">
                    <benefit.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Become a Partner
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="relative">
            <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-6">Partner Dashboard Preview</h3>
              
              <div className="space-y-4">
                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-80">Today's Orders</span>
                    <span className="text-2xl font-bold">47</span>
                  </div>
                  <div className="w-full bg-primary-foreground/20 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full w-3/4" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <span className="text-sm opacity-80">Revenue</span>
                    <p className="text-xl font-bold mt-1">₹1.2L</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <span className="text-sm opacity-80">Avg. Fulfillment</span>
                    <p className="text-xl font-bold mt-1">8 min</p>
                  </div>
                </div>

                <div className="bg-primary-foreground/10 rounded-xl p-4">
                  <span className="text-sm opacity-80">Top Selling Today</span>
                  <div className="mt-3 space-y-2">
                    {["Slim Fit Jeans - Blue", "Casual Linen Shirt", "Cotton Polo T-Shirt"].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <span className="text-xs opacity-60">{12 - i * 3} sold</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-secondary rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForStores;
