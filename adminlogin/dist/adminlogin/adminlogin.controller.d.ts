import { AdminloginService } from './adminlogin.service';
import type { AdminLogin } from './adminlogin.model';
export declare class AdminloginController {
    private readonly adminloginService;
    constructor(adminloginService: AdminloginService);
    postAdmin(postAdminDto: Partial<AdminLogin>): Promise<AdminLogin>;
    getAllAdmins(): Promise<AdminLogin[]>;
    getAdminById(id: string): Promise<AdminLogin>;
    putAdmin(id: string, putAdminDto: Partial<AdminLogin>): Promise<AdminLogin>;
    patchAdmin(id: string, updates: Partial<AdminLogin>): Promise<any>;
    deleteAdmin(id: string): Promise<any>;
}
