// ----------------------------------------------------------------------

export type ITourFilterValue = string | string[] | Date  | null;

export type ITourFilters = {
  tourGuides: ITourGuide[];
  destination: string[];
  services: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type ITourGuide = {
  id: string;
  name: string;
  avatarUrl: string;
  phoneNumber: string;
};

export type ITourBooker = {
  id: string;
  name: string;
  avatarUrl: string;
  guests: number;
};

export type ITourItem = {
  id: string;
  name: string;
  price: number;
  totalViews: number;
  tags: string[];
  content: string;
  publish: string;
  images: string[];
  durations: string;
  priceSale: number;
  services: string[];
  destination: string;
  ratingNumber: number;
  bookers: ITourBooker[];
  tourGuides: ITourGuide[];
  createdAt: Date;
  available: {
    startDate: Date;
    endDate: Date;
  };
};


export interface AdPost {
  _id: string;
  userId: string;
  brand: string;
  model: string;
  trimEdition: string;
  bodyType: string;
  category: string[]; // Array of categories
  createdAt: string; // ISO date string
  description: string; // HTML string
  engineCapacity: string; // Assuming engine capacity is a string (e.g., "800")
  fuelType: string;
  images: {
    imageUrl: string | undefined; url: string; alt?: string 
}[]; // Array of image objects, with optional alt text
  mileage: string; // e.g., "94000 km"
  mobileNumber: string;
  whatsappNumber: string;
  transmission: string;
  plane: string;
  postId: string;
  price: string; // e.g., "Rs 7,090,000"
  socialIcon: string[]; // e.g., ['heart']
  negotiable: boolean;
  verify: boolean;
  yearOfManufacture: string;
  updatedAt: string; // ISO date string
  [key: string]: any; // Optional index signature for any additional fields
}
