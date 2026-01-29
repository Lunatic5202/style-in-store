import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="bg-secondary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-secondary-foreground rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-foreground rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-secondary-foreground/10 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Join the fashion revolution</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
              Ready to shop smarter?
            </h2>
            <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-10">
              Get the clothes you want from stores you trust, delivered in minutes. 
              No more waiting, no more uncertainty.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                Download the App
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-secondary-foreground bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
