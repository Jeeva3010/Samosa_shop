import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const scrollToMenu = () => {
    const element = document.querySelector("#menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Delicious samosas and Indian snacks"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-primary/90 text-primary-foreground rounded-full animate-fade-in-up">
            Authentic Indian Street Food
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 animate-fade-in-up [animation-delay:0.2s] opacity-0">
            Taste the Tradition of
            <span className="block text-primary mt-2">Handcrafted Samosas</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.4s] opacity-0">
            Made with love using time-honored recipes passed down through generations. 
            Experience the crispy, golden perfection of our authentic samosas and traditional Indian snacks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:0.6s] opacity-0">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg"
            >
              Place Your Order
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToMenu}
              className="text-lg px-8 py-6 bg-card/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-card/40 font-semibold"
            >
              View Our Menu
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <button
          onClick={scrollToMenu}
          className="flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          aria-label="Scroll to menu"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ArrowDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;