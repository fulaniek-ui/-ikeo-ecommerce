export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface PaginatedData<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Category {
  id: number;
  name: string;
  name_id: string;
  slug: string;
  icon?: string;
  description?: string;
  description_id?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  products_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  products_count?: number;
}

export interface Product {
  id: number;
  category_id: number;
  brand_id: number;
  name: string;
  slug: string;
  description?: string;
  description_id?: string;
  price: number;
  discount_price?: number;
  image: string;
  stock: number;
  is_bestseller: boolean;
  is_featured: boolean;
  material?: string;
  dimensions?: string;
  weight?: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
  images?: ProductImage[];
  reviews?: Review[];
  reviews_avg_rating?: number;
  reviews_count?: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  variant_name: string;
  color?: string;
  size?: string;
  material?: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
}

export interface Address {
  id: number;
  user_id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'transfer' | 'ewallet';
  courier: 'JNE' | 'GoSend' | 'SiCepat';
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  notes?: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  address?: Address;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id?: number;
  product_name: string;
  variant_name?: string;
  price: number;
  quantity: number;
  subtotal: number;
  product?: Product;
  product_variant?: ProductVariant;
}

export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  product?: Product;
}

export interface Blog {
  id: number;
  author_id: number;
  title: string;
  title_id?: string;
  slug: string;
  excerpt?: string;
  excerpt_id?: string;
  content: string;
  content_id?: string;
  category: string;
  category_id_text?: string;
  image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: User;
  tags?: BlogTag[];
}

export interface BlogTag {
  id: number;
  blog_id: number;
  tag: string;
  tag_id?: string;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours_id?: string;
  hours_en?: string;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: number;
  user_id?: number;
  store_id?: number;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  user?: User;
  store?: Store;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export interface DashboardStats {
  categories: number;
  brands: number;
  products: number;
  users: number;
  orders: number;
  revenue: number;
  totalStock: number;
  outOfStock: number;
}
