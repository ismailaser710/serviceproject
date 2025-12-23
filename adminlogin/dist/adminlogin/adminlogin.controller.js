"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminloginController = void 0;
const common_1 = require("@nestjs/common");
const adminlogin_service_1 = require("./adminlogin.service");
let AdminloginController = class AdminloginController {
    adminloginService;
    constructor(adminloginService) {
        this.adminloginService = adminloginService;
    }
    async postAdmin(postAdminDto) {
        const { name, password } = postAdminDto;
        if (!name || !password) {
            throw new common_1.BadRequestException('Name and password are required');
        }
        const existingAdmin = await this.adminloginService.findByName(name);
        if (existingAdmin) {
            throw new common_1.BadRequestException('Admin name already exists');
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one uppercase letter and one number');
        }
        if (password.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        return this.adminloginService.post(postAdminDto);
    }
    async getAllAdmins() {
        return this.adminloginService.findAll();
    }
    async getAdminById(id) {
        return this.adminloginService.findOne(id);
    }
    async putAdmin(id, putAdminDto) {
        const { name, password } = putAdminDto;
        if (!name || !password) {
            throw new common_1.BadRequestException('Send all required fields: name, password');
        }
        const existingAdmin = await this.adminloginService.findByName(name);
        if (existingAdmin && existingAdmin._id.toString() !== id) {
            throw new common_1.BadRequestException('Name is already used by another admin');
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one uppercase letter and one number');
        }
        if (password.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        return this.adminloginService.put(id, putAdminDto);
    }
    async patchAdmin(id, updates) {
        if ((updates.name === undefined || updates.name.trim() === '') &&
            (updates.password === undefined ||
                updates.password === '' ||
                updates.password.trim() === '')) {
            throw new common_1.BadRequestException('At least one of name or password must be provided and not empty');
        }
        if (updates.name !== undefined) {
            const existingAdmin = await this.adminloginService.findByName(updates.name);
            if (existingAdmin && existingAdmin._id.toString() !== id) {
                throw new common_1.BadRequestException('Name is already registered by another admin');
            }
        }
        if (updates.password !== undefined) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
            if (!passwordRegex.test(updates.password)) {
                throw new common_1.BadRequestException('Password must contain at least one uppercase letter and one number');
            }
            if (updates.password.length < 8) {
                throw new common_1.BadRequestException('Password must be at least 8 characters long');
            }
        }
        return this.adminloginService.patch(id, updates);
    }
    async deleteAdmin(id) {
        return this.adminloginService.delete(id);
    }
};
exports.AdminloginController = AdminloginController;
__decorate([
    (0, common_1.Post)('post'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminloginController.prototype, "postAdmin", null);
__decorate([
    (0, common_1.Get)('getall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminloginController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.Get)('getone/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminloginController.prototype, "getAdminById", null);
__decorate([
    (0, common_1.Put)('put/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminloginController.prototype, "putAdmin", null);
__decorate([
    (0, common_1.Patch)('patch/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminloginController.prototype, "patchAdmin", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminloginController.prototype, "deleteAdmin", null);
exports.AdminloginController = AdminloginController = __decorate([
    (0, common_1.Controller)('adminlogin'),
    __metadata("design:paramtypes", [adminlogin_service_1.AdminloginService])
], AdminloginController);
//# sourceMappingURL=adminlogin.controller.js.map