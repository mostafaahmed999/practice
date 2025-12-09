import { Role } from '../services/user.service';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  roles: Role[];
  currentRole: Role;
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalCollections?: number;
  totalEarnings?: number;
  rating?: number;
}

