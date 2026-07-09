
export interface RentalRequest {
    propertyId: string;
    tenantId: string;
    message?: string;
    startDate: string | Date;
    endDate?: string | Date;
}