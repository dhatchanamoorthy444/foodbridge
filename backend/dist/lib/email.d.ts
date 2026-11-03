export declare function sendEmail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
}): Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    messageId?: undefined;
}>;
export declare function sendExpiryWarningEmail(email: string, foodItem: {
    name: string;
    category: string;
    expiry_date: string | Date;
}, daysUntilExpiry: number): Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    messageId?: undefined;
}>;
//# sourceMappingURL=email.d.ts.map