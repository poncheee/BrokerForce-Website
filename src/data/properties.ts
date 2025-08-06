export interface Property {
  id: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images: string[];
  type: 'house' | 'condo' | 'townhouse' | 'apartment';
  yearBuilt: number;
  description: string;
  features: string[];
}

export const sampleProperties: Property[] = [
  {
    id: '1',
    price: 850000,
    address: '123 Oak Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    type: 'house',
    yearBuilt: 2018,
    description: 'Beautiful modern home with stunning city views and updated finishes throughout.',
    features: ['Hardwood Floors', 'Updated Kitchen', 'City Views', 'Garage Parking']
  },
  {
    id: '2',
    price: 1200000,
    address: '456 Pine Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    beds: 4,
    baths: 3,
    sqft: 2800,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    type: 'house',
    yearBuilt: 2020,
    description: 'Luxury home in prestigious neighborhood with pool and modern amenities.',
    features: ['Swimming Pool', 'Modern Kitchen', 'Walk-in Closets', 'Smart Home Features']
  },
  {
    id: '3',
    price: 650000,
    address: '789 Maple Drive',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    beds: 2,
    baths: 2,
    sqft: 1500,
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
    ],
    type: 'condo',
    yearBuilt: 2015,
    description: 'Stylish condo in downtown Seattle with water views and modern finishes.',
    features: ['Water Views', 'Granite Counters', 'In-unit Laundry', 'Gym Access']
  },
  {
    id: '4',
    price: 425000,
    address: '321 Cedar Lane',
    city: 'Portland',
    state: 'OR',
    zipCode: '97201',
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop'
    ],
    type: 'townhouse',
    yearBuilt: 2010,
    description: 'Charming townhouse in quiet neighborhood with garden and updated interior.',
    features: ['Private Garden', 'Updated Bathrooms', 'Quiet Street', 'Near Parks']
  },
  {
    id: '5',
    price: 750000,
    address: '654 Birch Street',
    city: 'Denver',
    state: 'CO',
    zipCode: '80202',
    beds: 3,
    baths: 2,
    sqft: 2000,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&h=600&fit=crop'
    ],
    type: 'house',
    yearBuilt: 2017,
    description: 'Mountain view home with open floor plan and modern design elements.',
    features: ['Mountain Views', 'Open Floor Plan', 'Fireplace', '2-Car Garage']
  },
  {
    id: '6',
    price: 500000,
    address: '987 Elm Court',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    beds: 2,
    baths: 1,
    sqft: 1200,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      '/images/vibrant.jpg',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    type: 'apartment',
    yearBuilt: 2019,
    description: 'Modern apartment in vibrant downtown Austin with rooftop access.',
    features: ['Rooftop Access', 'Modern Appliances', 'Downtown Location', 'Pet Friendly']
  }
];