// src/types/index.ts
export type UserRole = 'admin' | 'resident' | 'collector';

export interface User {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  barangay: string;
  role: UserRole;
  photoURL?: string;
  creditScore: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'suspended' | 'pending';
}

export interface Report {
  id?: string;
  userId: string;
  reporterName: string;
  address: string;
  type: string;
  description: string;
  photoURL?: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface Violation {
  id?: string;
  userId: string;
  residentName: string;
  address: string;
  violationType: string;
  description: string;
  offenseCount: number;
  warningLevel: '1st_warning' | '2nd_warning' | 'final_warning' | 'sanction';
  status: 'active' | 'resolved';
  recordedBy: string;
  recordedByName: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  history: ViolationHistory[];
}

export interface ViolationHistory {
  date: Date;
  violation: string;
  action: string;
}

export interface Route {
  id?: string;
  zoneId: string;
  zoneName: string;
  barangay: string;
  collectorId: string;
  collectorName: string;
  areaCovered: string;
  households: number;
  streets: string[];
  schedule: {
    day: string;
    time: string;
  };
  status: 'pending' | 'in_progress' | 'completed';
  priority: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionSchedule {
  id?: string;
  routeId: string;
  day: string;
  date: string;
  time: string;
  wasteType: 'biodegradable' | 'recyclable' | 'residual' | 'hazardous';
  zone: string;
  status: 'scheduled' | 'collected' | 'missed';
  collectorId?: string;
  collectorName?: string;
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'warning' | 'announcement' | 'system';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Announcement {
  id?: string;
  adminId: string;
  adminName: string;
  title: string;
  content: string;
  type: 'event' | 'schedule' | 'info' | 'reminder' | 'urgent';
  urgent: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  binColor: string;
  collectionDay: string;
  examples: string[];
  tips: string[];
}

export interface CreditTransaction {
  id?: string;
  userId: string;
  points: number;
  reason: string;
  type: 'earned' | 'spent' | 'deducted';
  reference?: string;
  createdAt: Date;
}

export interface ScoreAction {
  id: string;
  type: 'increase' | 'decrease';
  points: number;
  reason: string;
  timestamp: Date;
}