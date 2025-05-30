import {IMAGES} from '../constants/images';

export const courtsData = [
  {
    id: '1',
    name: 'Central Padel Club',
    address: 'Calle Mayor 123, Madrid',
    location: {
      latitude: 40.4168,
      longitude: -3.7038,
    },
    image: IMAGES.img1,
    workingHours: 'Mon-Fri: 8:00-22:00, Sat-Sun: 9:00-20:00',
    available: true,
    rating: 4.5,
    description:
      'Central Padel Club offers top-tier padel courts with modern facilities. Enjoy a friendly atmosphere, professional staff, and a variety of services for all players.',
    services: [
      'Locker Rooms',
      'Equipment Rental',
      'Night Lighting',
      'Free Parking',
    ],
  },
  {
    id: '2',
    name: 'Greenfield Courts',
    address: 'Avinguda Diagonal 456, Barcelona',
    location: {
      latitude: 41.3851,
      longitude: 2.1734,
    },
    image: IMAGES.img2,
    workingHours: 'Mon-Fri: 7:00-21:00, Sat-Sun: 8:00-19:00',
    available: false,
    rating: 4.2,
    description:
      'Greenfield Courts is known for its lush surroundings and excellent playing surfaces. Perfect for both casual and competitive players.',
    services: ['Locker Rooms', 'Night Lighting', 'Free Parking'],
  },
  {
    id: '3',
    name: 'Riverside Padel',
    address: 'Paseo del Río 789, Valencia',
    location: {
      latitude: 39.4699,
      longitude: -0.3763,
    },
    image: IMAGES.img3,
    workingHours: 'Mon-Sun: 8:00-23:00',
    available: true,
    rating: 4.8,
    description:
      'Riverside Padel features riverside views and modern amenities. Enjoy a relaxing game with beautiful scenery.',
    services: ['Locker Rooms', 'Equipment Rental', 'Free Parking'],
  },
  {
    id: '4',
    name: 'Sunset Tennis Center',
    address: 'Calle Sevilla 321, Málaga',
    location: {
      latitude: 36.7213,
      longitude: -4.4217,
    },
    image: IMAGES.img4,
    workingHours: 'Mon-Fri: 9:00-21:00, Sat-Sun: 10:00-18:00',
    available: true,
    rating: 4.0,
    description:
      'Sunset Tennis Center offers both tennis and padel courts, with beautiful sunset views and great facilities.',
    services: ['Locker Rooms', 'Night Lighting'],
  },
  {
    id: '5',
    name: 'Lakeside Rackets',
    address: 'Paseo Marítimo 654, Palma de Mallorca',
    location: {
      latitude: 39.5696,
      longitude: 2.6502,
    },
    image: IMAGES.img5,
    workingHours: 'Mon-Sun: 7:00-20:00',
    available: false,
    rating: 3.9,
    description:
      'Lakeside Rackets is a family-friendly club with courts for all ages and skill levels, right by the lake.',
    services: ['Equipment Rental', 'Free Parking'],
  },
  {
    id: '6',
    name: 'Mountainview Sports',
    address: 'Calle Sierra Nevada 987, Granada',
    location: {
      latitude: 37.1773,
      longitude: -3.5986,
    },
    image: IMAGES.img6,
    workingHours: 'Mon-Fri: 8:00-22:00, Sat-Sun: 9:00-21:00',
    available: true,
    rating: 4.3,
    description:
      'Mountainview Sports offers courts with a view! Enjoy your game surrounded by mountains and fresh air.',
    services: ['Locker Rooms', 'Night Lighting', 'Free Parking'],
  },
  {
    id: '7',
    name: 'City Center Courts',
    address: 'Plaza Mayor 159, Salamanca',
    location: {
      latitude: 40.9647,
      longitude: -5.663,
    },
    image: IMAGES.img7,
    workingHours: 'Mon-Sun: 8:00-22:00',
    available: true,
    rating: 4.6,
    description:
      'City Center Courts is the go-to spot for urban padel lovers, with modern courts and easy access.',
    services: ['Locker Rooms', 'Equipment Rental'],
  },
  {
    id: '8',
    name: 'Forest Edge Club',
    address: 'Avenida de la Constitución 753, Sevilla',
    location: {
      latitude: 37.3891,
      longitude: -5.9845,
    },
    image: IMAGES.img8,
    workingHours: 'Mon-Fri: 8:00-20:00, Sat-Sun: 9:00-18:00',
    available: false,
    rating: 4.1,
    description:
      'Forest Edge Club is nestled at the edge of the woods, offering a peaceful and natural setting for your games.',
    services: ['Locker Rooms', 'Night Lighting', 'Free Parking'],
  },
];
