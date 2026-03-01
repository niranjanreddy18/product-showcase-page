import { motion } from "framer-motion";

interface ProductCardProps {
  name: string;
  price: string;
  category: string;
  image: string;
  index: number;
}

const ProductCard = ({ name, price, category, image, index }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="overflow-hidden rounded-sm bg-card mb-4">
        <img
          src={image}
          alt={name}
          className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
        {category}
      </p>
      <h3 className="font-body text-base font-medium text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{price}</p>
    </motion.div>
  );
};

export default ProductCard;
