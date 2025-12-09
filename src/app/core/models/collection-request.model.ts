export type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface CollectionRequest {
  id: number;
  material: string;
  weight: string;
  location: string;
  lat?: number;
  lng?: number;
  status: RequestStatus;
  date: string;
  distance?: string;
  citizenName?: string;
  citizenId?: number;
  collectorId?: number;
  estimatedQuantity?: number;
  preferredTime?: string;
  materials?: string[];
  estimatedArrivalTime?: string; // ISO string for estimated arrival time
  routeOrder?: number; // Order in the route (1, 2, 3, etc.)
}

