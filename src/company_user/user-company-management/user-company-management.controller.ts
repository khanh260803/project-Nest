import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UserCompanyManagementService } from './user-company-management.service';
import { CreateUserCompanyManagementDto } from './dto/create-user-company-management.dto';
import { UpdateUserCompanyManagementDto } from './dto/update-user-company-management.dto';
import { ResetPassDto } from 'src/admin/user-management/dto/reset-password.dto';
import { CustomRequest } from 'src/custom-request';
import { Roles } from 'src/authentication/middlewares/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('user-company-management')
export class UserCompanyManagementController {
  constructor(
    private readonly userCompanyManagementService: UserCompanyManagementService,
  ) {}

  @Post('add-user')
  @Roles(UserRole.CompanyUser)
  async addNewUser(
    @Body() createUser: CreateUserCompanyManagementDto,
    @Req() req: CustomRequest,
  ) {
    return this.userCompanyManagementService.addMemberForCompany(
      createUser,
      req,
    );
  }
  @Post('reset-pass')
  async resetPass(@Body() password: ResetPassDto) {
    return this.userCompanyManagementService.resetPass(password);
  }

  @Put(':id/edit-user')
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() infoUser: UpdateUserCompanyManagementDto,
    @Req() req: CustomRequest,
  ) {
    return this.userCompanyManagementService.editUser(id, infoUser, req);
  }

  @Put(':id/soft-delete')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userCompanyManagementService.softDelete(id);
  }

  @Put(':id/restore-user')
  restoreUser(@Param('id', ParseIntPipe) id: number) {
    return this.userCompanyManagementService.restoreUser(id);
  }
}
