import { ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display text-xl tracking-wide text-foreground">
          Atelier
        </a>

        <div className="hidden md:flex items-center gap-8">
          {["Shop", "New Arrivals", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {["Shop", "New Arrivals", "About"].map((item) => (
                <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
