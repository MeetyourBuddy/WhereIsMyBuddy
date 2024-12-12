import { IUserResponse } from './user.interface';

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface ServiceResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthServiceResponse extends ServiceResponse<{
    tokens: Tokens;
    user: IUserResponse;
}> {} 