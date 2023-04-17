export interface EventItem {
    name: string;
    time: string;
    email: string;
}
  
export interface CalendarData {
    [date: string]: EventItem[];
}