export interface Room {
  id?: string;
  pin: string;
  createdBy: string;
  currentIndex: number;
  expectedEndTime?: string;
}
