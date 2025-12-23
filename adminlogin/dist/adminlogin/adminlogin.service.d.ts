import { Model } from 'mongoose';
import { AdminLogin } from './adminlogin.model';
export declare class AdminloginService {
    private readonly adminLoginModel;
    constructor(adminLoginModel: Model<AdminLogin>);
    post(admin: AdminLogin): Promise<AdminLogin>;
    findAll(): Promise<AdminLogin[]>;
    findOne(id: string): Promise<AdminLogin>;
    findByName(name: string): Promise<AdminLogin | null>;
    put(id: string, admin: Partial<AdminLogin>): Promise<AdminLogin>;
    patch(id: string, updates: Partial<AdminLogin>): Promise<AdminLogin>;
    delete(id: string): Promise<any>;
}
