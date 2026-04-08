export interface EntityBase {
  id: string;
  uniqueKey: string; 
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED' | 'PENDING'; 
}

export type ViewMode = 'frameworks' | 'features';
