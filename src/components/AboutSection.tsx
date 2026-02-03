import { Heart, Leaf, Clock, Award } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every samosa is handcrafted with care, following recipes passed down through three generations of our family.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "We source the finest spices and freshest vegetables daily to ensure authentic, vibrant flavors in every bite.",
  },
  {
    icon: Clock,
    title: "Traditional Methods",
    description: "Our cooking techniques honor centuries-old traditions, from the perfect dough preparation to the ideal frying temperature.",
  },
  {
    icon: Award,
    title: "Quality Promise",
    description: "We never compromise on quality. Each item is prepared fresh and meets our strict standards before serving.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading text-foreground">Our Story</h2>
          <p className="section-subheading">
            Three generations of passion, tradition, and the pursuit of the perfect samosa.
          </p>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-background rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Welcome to <span className="text-primary font-semibold">Samosa House</span>, where 
                every bite tells a story of tradition, passion, and authentic Indian flavors. Our journey 
                began in a small kitchen, where our grandmother first taught us the art of making the 
                perfect samosa – crispy on the outside, bursting with aromatic spices on the inside.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Today, we continue that legacy with the same dedication and love. Each samosa is still 
                handcrafted using her original recipes, from the perfectly seasoned potato filling to 
                the golden, flaky pastry that has become our signature.
              </p>
              <p className="text-lg leading-relaxed">
                Beyond samosas, we've expanded our menu to include beloved South Indian snacks like 
                <span className="text-secondary font-medium"> Ullunthu Vadai</span> and 
                <span className="text-secondary font-medium"> Paruppu Vadai</span>, along with 
                flavorful sides that complement our main offerings. Every item on our menu carries the 
                same commitment to authenticity and quality.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="text-center p-6 rounded-2xl bg-background hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;