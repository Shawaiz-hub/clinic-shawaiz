
import React from 'react';
import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Zap className="h-6 w-6 text-primary" />
      <span className="font-heading text-xl font-bold">ClinicOptima</span>
    </div>
  );
};

export default Logo;
