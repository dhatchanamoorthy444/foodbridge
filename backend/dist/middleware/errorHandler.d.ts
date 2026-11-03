import { Request, Response, NextFunction } from 'express';
export interface ApiError extends Error {
    status?: number;
    errors?: Record<string, any>;
}
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=errorHandler.d.ts.map