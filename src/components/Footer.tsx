import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">KINAI</span>
      </div>
      <p className="text-xs text-muted-foreground">
        © 2026 KINAI. All rights reserved. Not a medical device.
      </p>
    </div>
  </footer>
);

export default Footer;
