
import React, { useState } from 'react';
import { VERSION, CHANGELOG } from '../version';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-muted/20 text-muted-foreground text-xs py-3 flex items-center justify-between px-4">
      <span>Created by nicram for ConsControlSystem {VERSION}</span>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Changelog
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Changelog {VERSION}</DialogTitle>
          </DialogHeader>
          <div className="text-sm whitespace-pre-wrap">
            {CHANGELOG}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
