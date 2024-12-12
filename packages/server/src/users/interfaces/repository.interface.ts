import { User } from '../schemas/user.schema';

export interface IBaseRepository<T> {
    findOne(filter: Partial<T>): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    updateRefreshToken(userId: string, token: string | null): Promise<void>;
}