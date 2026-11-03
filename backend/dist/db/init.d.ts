export interface TableStatus {
    table: string;
    ok: boolean;
    rows?: number;
    error?: {
        code?: string;
        message: string;
    };
}
export interface DbHealth {
    ok: boolean;
    checkedAt: string;
    tables: TableStatus[];
}
export declare function getDbHealth(): DbHealth;
export declare function verifySchema(): Promise<DbHealth>;
export declare function initializeDatabase(): Promise<void>;
//# sourceMappingURL=init.d.ts.map