export interface IPropertyListing {
    title: string;
    description: string;
    location: string;
    city: string;
    price: number;
    categoryId: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    amenities?: string[];
    images: string[];
}

export interface IUpdateRequestStatus {
    status: string;
    rejectionReason?: string;
}