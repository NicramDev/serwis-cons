
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-muted/20 text-muted-foreground text-xs py-3 flex items-center justify-center space-x-1 border-t border-border/50">
      <span>Created with</span>
      <Heart className="h-3 w-3 text-primary/70 fill-primary/20" />
      <span>by nicram</span>
    </footer>
  );
};

export default Footer;
