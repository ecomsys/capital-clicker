// src/components/earn/PromoCode.jsx

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function PromoCode({ className, onApply, placeholder = "Введите промокод" }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onApply && code.trim()) {
      onApply(code.trim());
      setCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2 w-full", className)}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 bg-tile border border-[#2f2f2f] rounded-[1rem] 
                   text-white text-[1rem] placeholder:text-white/19 focus:outline-none 
                   focus:border-golden focus:ring-1 focus:ring-golden min-w-0
                   transition-all duration-200"
      />
      <Button 
        type="submit"
        className="sm:min-w-36 bg-golden hover:bg-golden/80 text-white px-3 h-12.25 rounded-[1rem] whitespace-nowrap"
      >
        Применить
      </Button>
    </form>
  );
}