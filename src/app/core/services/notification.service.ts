import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
  id: string;
  type: 'collection' | 'reward' | 'badge' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'collection',
    title: 'Collection Completed',
    message: 'Your plastic bottles collection has been completed. You earned 50 points!',
    time: '2 hours ago',
    read: false,
    icon: 'Package',
  },
  {
    id: '2',
    type: 'reward',
    title: 'New Reward Available',
    message: "You've unlocked a new reward! Check the rewards page to redeem.",
    time: '5 hours ago',
    read: false,
    icon: 'Gift',
  },
  {
    id: '3',
    type: 'badge',
    title: 'Badge Earned',
    message: "Congratulations! You've earned the 'Green Warrior' badge.",
    time: '1 day ago',
    read: true,
    icon: 'Star',
  },
  {
    id: '4',
    type: 'collection',
    title: 'Collection Scheduled',
    message: 'A collector has accepted your request. Pickup scheduled for tomorrow.',
    time: '2 days ago',
    read: true,
    icon: 'Package',
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome to EcoCollect',
    message: 'Thank you for joining! Start recycling and earn rewards today.',
    time: '1 week ago',
    read: true,
    icon: 'Bell',
  },
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>(initialNotifications);
  
  unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  constructor() {
    // Simulate real-time notifications (demo purposes)
    setInterval(() => {
      const randomNotifications: Array<Omit<Notification, 'id' | 'time' | 'read'>> = [
        {
          type: 'collection',
          title: 'New Collection Request',
          message: 'A collector is nearby and ready to pick up your recyclables!',
          icon: 'Package',
        },
        {
          type: 'reward',
          title: 'Points Earned',
          message: 'You earned 25 points for your recent recycling activity!',
          icon: 'Gift',
        },
        {
          type: 'badge',
          title: 'Achievement Unlocked',
          message: "You're on a 7-day recycling streak! Keep it up!",
          icon: 'Star',
        },
      ];

      // 10% chance of getting a notification every 30 seconds
      if (Math.random() < 0.1) {
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        this.addNotification(randomNotif);
      }
    }, 30000);
  }

  addNotification(notification: Omit<Notification, 'id' | 'time' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'Just now',
      read: false,
    };
    
    this.notifications.update(prev => [newNotification, ...prev]);
  }

  markAsRead(id: string): void {
    this.notifications.update(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead(): void {
    this.notifications.update(prev => prev.map(n => ({ ...n, read: true })));
  }

  deleteNotification(id: string): void {
    this.notifications.update(prev => prev.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.notifications.set([]);
  }
}

