// Shared types for orders
// This mirrors the Prisma OrderStatus enum from the backend
export enum OrderStatus {
    PENDING = 'PENDING',
    STARTED_DELIVERY = 'STARTED_DELIVERY',
    DELIVERED = 'DELIVERED',
    PAYMENT_REQUIRED = 'PAYMENT_REQUIRED'
}
