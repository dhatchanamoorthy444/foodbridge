import type { FoodCategory, StorageRequirement } from './food';
export type EligibilityStatus = 'eligible' | 'ineligible' | 'pending';
export type RejectionReason = 'quantity_exceeded' | 'storage_incompatible' | 'category_mismatch' | 'pickup_unavailable' | 'expiry_imminent' | 'other';
export interface Recipient {
    id: string;
    userId: string;
    organization: string;
    maxCapacity: number;
    storageCapabilities: StorageRequirement[];
    acceptedCategories: FoodCategory[];
    pickupRadius: number;
    pickupHours: string[];
    currentInventory: number;
    weeklyPickups: number;
    status: EligibilityStatus;
    rating: number;
    notes?: string;
}
//# sourceMappingURL=recipient.d.ts.map