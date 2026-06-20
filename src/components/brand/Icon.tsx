// Mappt die Icon-Schlüssel aus den Vorlagen auf lucide-react Komponenten.
import {
  Route,
  BadgeCheck,
  Timer,
  PlugZap,
  MapPin,
  HeartHandshake,
  Package,
  Users,
  Receipt,
  Sprout,
  LineChart,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  route: Route,
  'badge-check': BadgeCheck,
  timer: Timer,
  'plug-zap': PlugZap,
  'map-pin': MapPin,
  'heart-handshake': HeartHandshake,
  package: Package,
  users: Users,
  receipt: Receipt,
  sprout: Sprout,
  'line-chart': LineChart,
  'shield-check': ShieldCheck,
};

export function Icon({
  name,
  size = 28,
  className,
  color = '#ff4a1c',
}: {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}) {
  const Cmp = MAP[name] ?? Route;
  return <Cmp size={size} className={className} style={{ color }} aria-hidden="true" />;
}
