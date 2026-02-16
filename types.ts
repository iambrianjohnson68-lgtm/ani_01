export type Category = 'Pizza' | 'Sides' | 'Starters' | 'Beverages' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isPopular: boolean;
  isAvailable: boolean;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface AppState {
  menu: MenuItem[];
  reservations: Reservation[];
  reviews: Review[];
}