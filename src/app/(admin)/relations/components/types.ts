export interface EntityBase {
  id: string;
  uniqueKey: string; 
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED' | 'PENDING' | null; 
}

export type ViewMode = 'frameworks' | 'features';
