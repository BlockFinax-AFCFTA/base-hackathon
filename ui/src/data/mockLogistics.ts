export interface Milestone {
  name: string;
  status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
  timestamp: Date | null;
  location?: string;
  notes?: string;
}

export interface Logistics {
  id: number;
  userId: number;
  contractId: number | null;
  type: 'BOOKING' | 'TRACKING';
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  origin: string;
  destination: string;
  shipmentDate: Date;
  cargoType: string;
  weight: string;
  specialRequirements: string | null;
  providerId: number | null;
  trackingNumber: string | null;
  milestones: Record<string, Milestone> | null;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogisticsProvider {
  id: number;
  name: string;
  logo: string;
  rating: string;
  specialties: string[];
  description: string;
  basePrice: string;
  currency: string;
  estimatedDays: number;
  address?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  yearEstablished?: number;
  fleetSize?: number;
  certificates?: any[];
  sustainabilityRating?: string;
}

export const mockLogistics: Logistics[] = [
  {
    id: 1,
    userId: 1,
    contractId: 1,
    type: 'TRACKING',
    status: 'IN_TRANSIT',
    origin: 'Tokyo, Japan',
    destination: 'Los Angeles, USA',
    shipmentDate: new Date('2025-04-20'),
    cargoType: 'Electronics',
    weight: '2500 kg',
    specialRequirements: 'Handle with care, temperature-controlled container',
    providerId: 1,
    trackingNumber: 'MSC9876543210',
    milestones: {
      'order_created': {
        name: 'Order Created',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-15'),
        notes: 'Order placed and confirmed'
      },
      'pickup_scheduled': {
        name: 'Pickup Scheduled',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-18'),
        location: 'Tokyo Warehouse',
        notes: 'Pickup scheduled with supplier'
      },
      'picked_up': {
        name: 'Cargo Picked Up',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-20'),
        location: 'Tokyo Warehouse',
        notes: 'Cargo collected from supplier'
      },
      'customs_export': {
        name: 'Export Customs',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-21'),
        location: 'Tokyo Port',
        notes: 'Export documentation processed'
      },
      'vessel_loaded': {
        name: 'Loaded on Vessel',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-22'),
        location: 'Tokyo Port',
        notes: 'Container loaded on MSC Osaka vessel'
      },
      'vessel_departed': {
        name: 'Vessel Departed',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-23'),
        location: 'Tokyo Port',
        notes: 'Vessel departed port'
      },
      'in_transit': {
        name: 'In Transit',
        status: 'IN_PROGRESS',
        timestamp: new Date('2025-04-23'),
        location: 'Pacific Ocean',
        notes: 'Currently in transit across Pacific'
      },
      'arrival_port': {
        name: 'Arrival at Port',
        status: 'PENDING',
        timestamp: null,
        location: 'Los Angeles Port',
      },
      'customs_import': {
        name: 'Import Customs',
        status: 'PENDING',
        timestamp: null,
        location: 'Los Angeles Port',
      },
      'delivery': {
        name: 'Final Delivery',
        status: 'PENDING',
        timestamp: null,
        location: 'Los Angeles Warehouse',
      }
    },
    estimatedDelivery: new Date('2025-05-10'),
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-23')
  },
  {
    id: 2,
    userId: 1,
    contractId: 2,
    type: 'BOOKING',
    status: 'CONFIRMED',
    origin: 'São Paulo, Brazil',
    destination: 'Seattle, USA',
    shipmentDate: new Date('2025-05-01'),
    cargoType: 'Coffee Beans',
    weight: '5000 kg',
    specialRequirements: 'Maintain low humidity, avoid direct sunlight',
    providerId: 2,
    trackingNumber: null,
    milestones: {
      'booking_created': {
        name: 'Booking Created',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-22'),
        notes: 'Booking request submitted'
      },
      'booking_confirmed': {
        name: 'Booking Confirmed',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-24'),
        notes: 'Carrier confirmed booking'
      },
      'documents_submitted': {
        name: 'Documents Submitted',
        status: 'IN_PROGRESS',
        timestamp: new Date('2025-04-25'),
        notes: 'Shipping documents being processed'
      }
    },
    estimatedDelivery: new Date('2025-05-20'),
    createdAt: new Date('2025-04-22'),
    updatedAt: new Date('2025-04-25')
  }
];

export const mockLogisticsProviders: LogisticsProvider[] = [
  {
    id: 1,
    name: 'Global Shipping Co.',
    logo: '/logos/global-shipping.svg',
    rating: '4.8',
    specialties: ['Container Shipping', 'Temperature-Controlled', 'Hazardous Materials'],
    description: 'Leading global shipping company with extensive routes across Asia and the Americas',
    basePrice: '2500',
    currency: 'USDC',
    estimatedDays: 18,
    address: '789 Ocean Avenue, Long Beach, CA 90802',
    website: 'https://globalshipping.example.com',
    contactEmail: 'bookings@globalshipping.example.com',
    contactPhone: '+1-213-555-0123',
    yearEstablished: 1998,
    fleetSize: 75,
    certificates: [
      'ISO 9001:2015',
      'ISO 14001:2015',
      'C-TPAT Certified'
    ],
    sustainabilityRating: 'A-'
  },
  {
    id: 2,
    name: 'Maritime Express',
    logo: '/logos/maritime-express.svg',
    rating: '4.6',
    specialties: ['Bulk Cargo', 'Agricultural Products', 'Project Cargo'],
    description: 'Specialized in agricultural and bulk commodity shipping across the globe',
    basePrice: '2200',
    currency: 'USDC',
    estimatedDays: 20,
    address: '456 Harbor Blvd, Miami, FL 33132',
    website: 'https://maritime-express.example.com',
    contactEmail: 'info@maritime-express.example.com',
    contactPhone: '+1-305-555-0789',
    yearEstablished: 2005,
    fleetSize: 42,
    certificates: [
      'ISO 9001:2015',
      'HACCP Certified',
      'Fair Trade Logistics Partner'
    ],
    sustainabilityRating: 'B+'
  },
  {
    id: 3,
    name: 'Air Express Cargo',
    logo: '/logos/air-express.svg',
    rating: '4.9',
    specialties: ['Air Freight', 'Expedited Shipping', 'Valuable Cargo'],
    description: 'Premium air freight services for time-sensitive and high-value shipments',
    basePrice: '4500',
    currency: 'USDC',
    estimatedDays: 5,
    address: '123 Air Cargo Way, Memphis, TN 38118',
    website: 'https://airexpress.example.com',
    contactEmail: 'bookings@airexpress.example.com',
    contactPhone: '+1-901-555-4567',
    yearEstablished: 2010,
    fleetSize: 28,
    certificates: [
      'IATA Certified',
      'ISO 9001:2015',
      'Known Shipper Certified'
    ],
    sustainabilityRating: 'A'
  }
];