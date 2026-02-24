import { motion } from "framer-motion";
import Image from "next/image";

export const Greeting = () => {
  return (
    <div
      className="mr-auto text-left flex max-w-3xl flex-col items-start justify-center px-4"
      key="overview"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl mb-2 flex gap-2 items-center font-lora"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.2 }}
      >
        <Image
          alt="App logo"
          className="h-7 w-7"
          height={40}
          src="/images/logo/icon.svg"
          width={40}
        />
        Hello there!
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-[32px] font-lora"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.3 }}
      >
        Where should we start?
      </motion.div>
    </div>
  );
};
