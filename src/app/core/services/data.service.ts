import { Injectable, signal, computed } from '@angular/core';
import { CollectionRequest, RequestStatus } from '../models/collection-request.model';
import { Stat } from '../models/stat.model';
import { Reward, Badge, PointHistory } from '../models/reward.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Collection Requests
  private _collectionRequests = signal<CollectionRequest[]>(this.getInitialRequests());
  collectionRequests = this._collectionRequests.asReadonly();

  // User Stats
  private _userStats = signal<Stat[]>(this.getInitialStats());
  userStats = this._userStats.asReadonly();

  // Rewards
  private _rewards = signal<Reward[]>(this.getInitialRewards());
  rewards = this._rewards.asReadonly();

  // Badges
  private _badges = signal<Badge[]>(this.getInitialBadges());
  badges = this._badges.asReadonly();

  // Point History
  private _pointHistory = signal<PointHistory[]>(this.getInitialPointHistory());
  pointHistory = this._pointHistory.asReadonly();

  // Current User
  private _currentUser = signal<User>(this.getInitialUser());
  currentUser = this._currentUser.asReadonly();

  // Computed values
  pendingRequests = computed(() => 
    this._collectionRequests().filter(r => r.status === 'pending')
  );

  inProgressRequests = computed(() => 
    this._collectionRequests().filter(r => r.status === 'in-progress')
  );

  completedRequests = computed(() => 
    this._collectionRequests().filter(r => r.status === 'completed')
  );

  earnedBadges = computed(() => 
    this._badges().filter(b => b.earned)
  );

  // Methods for Collection Requests
  getRequestsByStatus(status: RequestStatus): CollectionRequest[] {
    return this._collectionRequests().filter(r => r.status === status);
  }

  getRequestsByCitizenId(citizenId: number): CollectionRequest[] {
    return this._collectionRequests().filter(r => r.citizenId === citizenId);
  }

  getRequestsByCollectorId(collectorId: number): CollectionRequest[] {
    return this._collectionRequests().filter(r => r.collectorId === collectorId);
  }

  updateRequestStatus(requestId: number, status: RequestStatus, collectorId?: number, estimatedArrivalTime?: string, routeOrder?: number): void {
    const requests = this._collectionRequests().map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          ...(collectorId !== undefined && { collectorId }),
          ...(estimatedArrivalTime !== undefined && { estimatedArrivalTime }),
          ...(routeOrder !== undefined && { routeOrder })
        };
      }
      return r;
    });
    this._collectionRequests.set(requests);
  }

  acceptRequestForRoute(requestId: number, collectorId: number, estimatedArrivalTime: string, routeOrder: number): void {
    this.updateRequestStatus(requestId, 'in-progress', collectorId, estimatedArrivalTime, routeOrder);
  }

  addRequest(request: CollectionRequest): void {
    const requests = [...this._collectionRequests(), request];
    this._collectionRequests.set(requests);
  }

  // Methods for Rewards
  redeemReward(rewardId: number): boolean {
    const reward = this._rewards().find(r => r.id === rewardId);
    const user = this._currentUser();
    
    if (!reward || !reward.available || user.points < reward.points) {
      return false;
    }

    // Update user points
    this._currentUser.update(u => ({
      ...u,
      points: u.points - reward.points
    }));

    // Add to point history
    const historyEntry: PointHistory = {
      id: Date.now(),
      action: `Redeemed: ${reward.title}`,
      points: reward.points,
      date: new Date().toISOString().split('T')[0],
      type: 'redeemed',
      relatedId: rewardId
    };
    this._pointHistory.update(h => [historyEntry, ...h]);

    return true;
  }

  addPoints(points: number, reason: string, relatedId?: number): void {
    this._currentUser.update(u => ({
      ...u,
      points: u.points + points
    }));

    const historyEntry: PointHistory = {
      id: Date.now(),
      action: reason,
      points,
      date: new Date().toISOString().split('T')[0],
      type: 'earned' as const,
      ...(relatedId !== undefined && { relatedId })
    };
    this._pointHistory.update(h => [historyEntry, ...h]);
  }

  updateUserStats(statType: 'collections' | 'co2' | 'points', value: number): void {
    const user = this._currentUser();
    
    if (statType === 'collections') {
      this._currentUser.update(u => ({
        ...u,
        totalCollections: (u.totalCollections || 0) + value
      }));
    }
    
    // Update stats array
    const stats = this._userStats().map(stat => {
      if (stat.id === 'total-collections' && statType === 'collections') {
        return {
          ...stat,
          value: String((user.totalCollections || 0) + value)
        };
      }
      return stat;
    });
    this._userStats.set(stats);
  }

  // Methods for Stats
  updateStats(stats: Stat[]): void {
    this._userStats.set(stats);
  }

  // Initial Data
  private getInitialRequests(): CollectionRequest[] {
    return [
      {
        id: 1,
        material: 'Plastic Bottles',
        weight: '15 kg',
        location: 'Downtown Cairo',
        lat: 30.0444,
        lng: 31.2357,
        status: 'pending',
        date: '2025-11-28',
        distance: '2.3 km',
        citizenName: 'Ahmed Ali',
        citizenId: 1,
        materials: ['plastic']
      },
      {
        id: 2,
        material: 'Paper & Cardboard',
        weight: '25 kg',
        location: 'Nasr City',
        lat: 30.0626,
        lng: 31.3169,
        status: 'in-progress',
        date: '2025-11-29',
        distance: '5.1 km',
        citizenName: 'Fatima Hassan',
        citizenId: 2,
        collectorId: 1,
        materials: ['paper']
      },
      {
        id: 3,
        material: 'Glass Containers',
        weight: '12 kg',
        location: 'Maadi',
        lat: 29.9608,
        lng: 31.2750,
        status: 'pending',
        date: '2025-11-30',
        distance: '8.7 km',
        citizenName: 'Mohamed Salah',
        citizenId: 3,
        materials: ['glass']
      },
      {
        id: 4,
        material: 'Metal Cans',
        weight: '8 kg',
        location: 'Zamalek',
        lat: 30.0633,
        lng: 31.2189,
        status: 'pending',
        date: '2025-12-01',
        distance: '3.5 km',
        citizenName: 'Sara Ahmed',
        citizenId: 4,
        materials: ['metal']
      },
      {
        id: 5,
        material: 'Mixed Recyclables',
        weight: '20 kg',
        location: 'Heliopolis',
        lat: 30.0875,
        lng: 31.3244,
        status: 'completed',
        date: '2025-11-27',
        distance: '4.2 km',
        citizenName: 'Omar Khaled',
        citizenId: 5,
        collectorId: 1,
        materials: ['plastic', 'paper']
      },
      {
        id: 6,
        material: 'Plastic Bottles',
        weight: '18 kg',
        location: 'New Cairo',
        lat: 30.0131,
        lng: 31.5000,
        status: 'completed',
        date: '2025-11-26',
        distance: '12.1 km',
        citizenName: 'Nour Ibrahim',
        citizenId: 6,
        collectorId: 1,
        materials: ['plastic']
      }
    ];
  }

  private getInitialStats(): Stat[] {
    return [
      {
        id: 'total-collections',
        icon: '📦',
        label: 'Total Collections',
        value: '48',
        change: '+5 this week',
        color: 'text-primary'
      },
      {
        id: 'earnings',
        icon: '💰',
        label: 'Earnings',
        value: '$1,240',
        change: '+$180 today',
        color: 'text-green-500'
      },
      {
        id: 'rating',
        icon: '⭐',
        label: 'Rating',
        value: '4.8',
        change: 'From 120 reviews',
        color: 'text-accent'
      },
      {
        id: 'active-routes',
        icon: '🚛',
        label: 'Active Routes',
        value: '3',
        change: 'In progress',
        color: 'text-primary'
      }
    ];
  }

  private getInitialRewards(): Reward[] {
    return [
      {
        id: 1,
        title: 'Discount Voucher',
        description: '10% off on eco-friendly products',
        points: 500,
        icon: '🎫',
        category: 'popular',
        available: true
      },
      {
        id: 2,
        title: 'Gift Card',
        description: '$25 shopping gift card',
        points: 1000,
        icon: '💳',
        category: 'popular',
        available: true
      },
      {
        id: 3,
        title: 'Eco Kit',
        description: 'Reusable shopping bag set',
        points: 750,
        icon: '🛍️',
        category: 'special',
        available: true
      },
      {
        id: 4,
        title: 'Tree Planting',
        description: 'Plant a tree in your name',
        points: 800,
        icon: '🌳',
        category: 'special',
        available: true
      },
      {
        id: 5,
        title: 'Premium Subscription',
        description: '1 month premium features',
        points: 1500,
        icon: '👑',
        category: 'premium',
        available: true
      },
      {
        id: 6,
        title: 'Charity Donation',
        description: 'Donate to environmental charity',
        points: 600,
        icon: '❤️',
        category: 'special',
        available: true
      }
    ];
  }

  private getInitialBadges(): Badge[] {
    return [
      {
        id: 1,
        name: 'Green Warrior',
        description: 'Complete 10 collections',
        icon: '🌿',
        earned: true,
        earnedDate: '2025-11-15',
        requirements: 'Complete 10 collections'
      },
      {
        id: 2,
        name: 'Top Recycler',
        description: 'Recycle 100kg',
        icon: '🏆',
        earned: true,
        earnedDate: '2025-11-20',
        requirements: 'Recycle 100kg total'
      },
      {
        id: 3,
        name: 'Weekly Eco Hero',
        description: 'Top recycler this week',
        icon: '⭐',
        earned: false,
        requirements: 'Be top recycler in a week'
      },
      {
        id: 4,
        name: 'Plastic Master',
        description: 'Recycle 50kg plastic',
        icon: '♻️',
        earned: false,
        requirements: 'Recycle 50kg of plastic'
      }
    ];
  }

  private getInitialPointHistory(): PointHistory[] {
    return [
      {
        id: 1,
        action: 'Plastic collection completed',
        points: 50,
        date: '2025-11-28',
        type: 'earned',
        relatedId: 1
      },
      {
        id: 2,
        action: 'Paper collection completed',
        points: 30,
        date: '2025-11-27',
        type: 'earned',
        relatedId: 2
      },
      {
        id: 3,
        action: 'Redeemed: Discount Voucher',
        points: 500,
        date: '2025-11-25',
        type: 'redeemed',
        relatedId: 1
      },
      {
        id: 4,
        action: 'Glass collection completed',
        points: 40,
        date: '2025-11-24',
        type: 'earned',
        relatedId: 3
      },
      {
        id: 5,
        action: 'Metal collection completed',
        points: 60,
        date: '2025-11-23',
        type: 'earned',
        relatedId: 4
      }
    ];
  }

  private getInitialUser(): User {
    return {
      id: 1,
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+20 123 456 7890',
      address: 'Cairo, Egypt',
      roles: ['citizen', 'collector'],
      currentRole: 'citizen',
      points: 1250,
      level: 'gold',
      totalCollections: 24,
      totalEarnings: 1240,
      rating: 4.8
    };
  }

  // TODO: Methods to be replaced with API calls
  // async getRequests(): Promise<CollectionRequest[]>
  // async createRequest(request: CollectionRequest): Promise<CollectionRequest>
  // async updateRequest(id: number, updates: Partial<CollectionRequest>): Promise<CollectionRequest>
  // async redeemReward(rewardId: number): Promise<boolean>
}

