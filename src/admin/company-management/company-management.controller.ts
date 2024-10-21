import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CompanyManagementService } from './company-management.service';
import { createNewCompany } from './dto/create-company-management.dto';
import { CustomRequest } from 'src/custom-request';
import { updateCompany } from './dto/update-company.dto';
import { RolesGuard } from 'src/authentication/middlewares/roles.guard';
import { Roles } from 'src/authentication/middlewares/role.decorator';
import { UserRole } from '@prisma/client';

@Controller({ path: 'company-management' }) //version 1 nếu muốn thêm version 2 thì thêm dưới
export class CompanyManagementController {
  constructor(
    private readonly companyManagementService: CompanyManagementService,
  ) {}

  @Get('get-user')
  async getAllCompany() {
    return this.companyManagementService.getAllCompany();
  }
  @Post('create-company')
  @Roles(UserRole.Admin)
  async createNewUser(
    @Body() createNewCompany: createNewCompany,
    @Req() req: CustomRequest,
  ) {
    return this.companyManagementService.createNewUser(createNewCompany, req);
  }
  @Put(':id/update')
  updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: updateCompany,
  ) {
    return this.companyManagementService.updateCompany(id, updateCompanyDto);
  }
  @Put(':id/soft-delete')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.companyManagementService.softDelete(id);
  }
  @Put(':id/restore-company')
  restoreCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companyManagementService.restoreCompany(id);
  }
}
