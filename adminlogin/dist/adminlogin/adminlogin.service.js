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
exports.AdminloginService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AdminloginService = class AdminloginService {
    adminLoginModel;
    constructor(adminLoginModel) {
        this.adminLoginModel = adminLoginModel;
    }
    async post(admin) {
        const newAdmin = new this.adminLoginModel(admin);
        return await newAdmin.save();
    }
    async findAll() {
        return await this.adminLoginModel.find().exec();
    }
    async findOne(id) {
        const admin = await this.adminLoginModel.findById(id).exec();
        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin;
    }
    async findByName(name) {
        return await this.adminLoginModel.findOne({ name }).exec();
    }
    async put(id, admin) {
        const updatedAdmin = await this.adminLoginModel
            .findByIdAndUpdate(id, admin, { new: true })
            .exec();
        if (!updatedAdmin) {
            throw new Error('Admin not found');
        }
        return updatedAdmin;
    }
    async patch(id, updates) {
        const updatedAdmin = await this.adminLoginModel
            .findByIdAndUpdate(id, updates, { new: true })
            .exec();
        if (!updatedAdmin) {
            throw new Error('Admin not found');
        }
        return updatedAdmin;
    }
    async delete(id) {
        const result = await this.adminLoginModel
            .deleteOne({ _id: id })
            .exec();
        if (result.deletedCount === 0) {
            throw new Error('Admin not found');
        }
        return { message: 'Admin deleted successfully' };
    }
};
exports.AdminloginService = AdminloginService;
exports.AdminloginService = AdminloginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('AdminLogin')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminloginService);
//# sourceMappingURL=adminlogin.service.js.map