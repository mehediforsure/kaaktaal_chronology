'use client';

import React from 'react';
import { m, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex-1 flex flex-col h-full min-h-0 w-full"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
