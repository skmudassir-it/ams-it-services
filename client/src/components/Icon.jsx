import {
  Code2, ShoppingBag, LayoutDashboard, Smartphone, PenTool, Cloud, Search, Megaphone, Users, Plug, Database,
  ShieldCheck, FileText, Layers, Newspaper, PenLine, UserX, FileWarning, History, ScanFace, QrCode, ScrollText,
  ScanLine, Sparkles,
} from 'lucide-react';

// Explicit map keeps the bundle small (no wildcard lucide import).
const icons = {
  Code2, ShoppingBag, LayoutDashboard, Smartphone, PenTool, Cloud, Search, Megaphone, Users, Plug, Database,
  ShieldCheck, FileText, Layers, Newspaper, PenLine, UserX, FileWarning, History, ScanFace, QrCode, ScrollText, ScanLine,
};

export default function Icon({ name, ...props }) {
  const Cmp = icons[name] || Sparkles;
  return <Cmp {...props} />;
}
