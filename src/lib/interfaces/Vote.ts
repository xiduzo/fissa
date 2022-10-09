export interface Vote {
  createdBy: string;
  state: 'up' | 'down';
  trackId: string;
}
