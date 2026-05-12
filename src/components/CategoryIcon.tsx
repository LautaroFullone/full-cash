import {
  Briefcase,
  Rocket,
  Gift,
  Building2,
  HandCoins,
  CircleDollarSign,
  Home,
  UtensilsCrossed,
  Wifi,
  Gamepad2,
  Car,
  Heart,
  GraduationCap,
  Shirt,
  CreditCard,
  PawPrint,
  MoreHorizontal,
  type LucideProps,
} from 'lucide-react';
import { CATEGORY_ICON_MAP } from '@/types';

const iconComponents: Record<string, React.ComponentType<LucideProps>> = {
  Briefcase,
  Rocket,
  Gift,
  Building2,
  HandCoins,
  CircleDollarSign,
  Home,
  UtensilsCrossed,
  Wifi,
  Gamepad2,
  Car,
  Heart,
  GraduationCap,
  Shirt,
  CreditCard,
  PawPrint,
  MoreHorizontal,
};

interface CategoryIconProps {
  categoryName: string;
  iconName?: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ categoryName, iconName, size = 20, className = '' }: CategoryIconProps) {
  const resolvedIconName = iconName || CATEGORY_ICON_MAP[categoryName] || 'CircleDollarSign';
  const IconComponent = iconComponents[resolvedIconName] || CircleDollarSign;

  return <IconComponent size={size} className={className} strokeWidth={1.8} />;
}
