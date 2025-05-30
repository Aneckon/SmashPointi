import {ImageSourcePropType} from 'react-native';
import {IMAGES} from '../constants/images';

export interface Announcement {
  id: number;
  title: string;
  date: string;
  image: ImageSourcePropType;
  content: string;
  availableSlots?: number;
  registeredUsers?: number;
  courtName?: string;
  address?: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Summer Tournament Registration Open',
    date: '2025-06-19',
    image: IMAGES.announcement1,
    content:
      'Join our annual summer tournament for beginners and players with level D-,D, D+! Registration is now open for all members. Early bird discounts available until June 15th.',
    availableSlots: 32,
    registeredUsers: 18,
    courtName: 'Main Tennis Center',
    address: 'Calle de la Raqueta 123, Madrid, 28001',
  },
  {
    id: 2,
    title: 'New Courts Opening Next Month',
    date: '2025-06-18',
    image: IMAGES.announcement2,
    content:
      'We are excited to announce the opening of 4 new indoor courts next month. Book your sessions now!',
    availableSlots: 100,
    registeredUsers: 12,
    courtName: 'Downtown Tennis Complex',
    address: 'Avenida del Tenis 456, Barcelona, 08001',
  },
];
