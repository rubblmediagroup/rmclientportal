export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  permissions: Permission[];
  joinedAt: string;
  lastActive: string;
  avatar?: string;
  department?: string;
  manager?: string;
}

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: number;
  color: string;
}

export interface Permission {
  id: string;
  name: string;
  category: 'project' | 'file' | 'budget' | 'timeline' | 'team' | 'admin';
  description: string;
}

export interface TeamActivity {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface GuestToken {
  id: string;
  token: string;
  type: 'project' | 'file' | 'time-limited' | 'feature-limited';
  permissions: string[];
  expiresAt: string;
  usageLimit?: number;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  guestInfo: {
    name: string;
    email: string;
    company?: string;
  };
}