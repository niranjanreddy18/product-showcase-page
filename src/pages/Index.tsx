import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { name: "Messenger Bag", price: "$245", category: "Leather Goods", image: product1 },
  { name: "Ceramic Mug", price: "$38", category: "Homeware", image: product2 },
  { name: "Studio Headphones", price: "$189", category: "Audio", image: product3 },
  { name: "Dome Desk Lamp", price: "$120", category: "Lighting", image: product4 },
  { name: "Merino Scarf", price: "$85", category: "Accessories", image: product5 },
  { name: "Leather Journal", price: "$62", category: "Stationery", image: product6 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-display text-foreground leading-[1.1] mb-6">
            Crafted for
            <br />
            <span className="text-primary">everyday</span> life
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Thoughtfully designed objects that bring beauty and function to your daily rituals.
          </p>
        </motion.div>
      </section>

      {/* Products */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl text-foreground">Featured</h2>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            View all
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {products.map((product, i) => (
            <ProductCard key={product.name} {...product} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg text-foreground">Atelier</span>
          <p className="text-xs text-muted-foreground">
            © 2026 Atelier. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
