
import React from 'react';
import { VERSION } from '../version';

const Footer = () => {
  return (
    <footer className="w-full bg-muted/20 text-muted-foreground text-xs py-3 flex items-center justify-center">
      <span>Created by nicram for ConsControlSystem {VERSION}</span>
    </footer>
  );
};

export default Footer;
