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
  UseFilters,
} from '@nestjs/common';
import { CompanyManagementService } from './company-management.service';
import { createNewCompany } from './dto/create-company-management.dto';
import { CustomRequest } from 'src/custom-request';
import { updateCompany } from './dto/update-company.dto';
import { RolesGuard } from 'src/common/middlewares/roles.guard';
import { Roles } from 'src/common/middlewares/role.decorator';
import { UserRole, Company, Status } from '../../types/prisma.types';

@Controller({ path: 'company-management' })
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
  @Roles(UserRole.Admin)
  updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: updateCompany,
  ) {
    return this.companyManagementService.updateCompany(id, updateCompanyDto);
  }

  @Put(':id/soft-delete')
  @Roles(UserRole.Admin)
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.companyManagementService.softDelete(id);
  }

  @Put(':id/restore-company')
  @Roles(UserRole.Admin)
  restoreCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companyManagementService.restoreCompany(id);
  }
}
