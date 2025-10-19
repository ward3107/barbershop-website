import { Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-3"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Scissors className="h-8 w-8 text-[#C4A572]" strokeWidth={2.5} />
      </motion.div>
      <span className="text-2xl font-bold text-[#FFD700] tracking-wider">
        SHOKHA
      </span>
    </motion.div>
  );
}