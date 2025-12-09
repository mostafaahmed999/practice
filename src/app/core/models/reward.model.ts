export interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: 'popular' | 'special' | 'premium';
  available: boolean;
  imageUrl?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  requirements?: string;
}

export interface PointHistory {
  id: number;
  action: string;
  points: number;
  date: string;
  type: 'earned' | 'redeemed';
  relatedId?: number;
}

