// Color types
export type ColorToken = 
  | 'primary' | 'on-primary' | 'primary-container' | 'on-primary-container'
  | 'secondary' | 'on-secondary' | 'secondary-container' | 'on-secondary-container'
  | 'tertiary' | 'on-tertiary' | 'tertiary-container' | 'on-tertiary-container'
  | 'surface' | 'on-surface' | 'on-surface-variant' | 'surface-variant'
  | 'surface-container' | 'surface-container-low' | 'surface-container-lowest'
  | 'outline' | 'outline-variant' | 'error' | 'on-error' | 'success' | 'warning' | 'info';

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Entradas' | 'Fondos' | 'Bebidas' | 'Postres';
  tags?: string[];
  calories?: number;
  protein?: string;
  carbs?: string;
  fats?: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order item types
export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
  status?: 'pending' | 'cooking' | 'ready';
}

// Order types
export interface Order {
  id: string;
  table?: string;
  waiter?: string;
  time: string;
  items: OrderItem[];
  status: 'pending' | 'cooking' | 'ready' | 'delivered';
  type: 'dine-in' | 'takeaway' | 'delivery';
  deliveryApp?: string;
}

// Dashboard metrics types
export interface Metric {
  label: string;
  value: string | number;
  trend?: string;
  icon: string;
  color: ColorToken;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  margin?: number;
}

// Checkout form types
export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: 'card' | 'yape';
}

// Sidebar navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// Common event handlers
export type ClickHandler = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
export type ChangeHandler<T> = (e: React.ChangeEvent<T>) => void;
export type SubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;
