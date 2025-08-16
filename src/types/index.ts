export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  subcategory: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'national' | 'international' | 'state';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
  applicationLink: string;
  type: 'private' | 'government';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  createdAt: string;
  isApproved: boolean;
}

export interface PaymentSettings {
  url: string;
  isActive: boolean;
  updatedAt: string;
}