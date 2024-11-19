import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { CreateUserManagementDto } from './dto/create-user-management.dto';
import { UpdateUserManagementDto } from './dto/update-user-management.dto';
import { ResetPassDto } from './dto/reset-password.dto';
import { Roles } from 'src/common/middlewares/role.decorator';
import { UserRole } from '@prisma/client';
import { CustomRequest } from 'src/custom-request';

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('add-user')
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  async addNewUser(
    @Body() createUser: CreateUserManagementDto,
    @Req() req: CustomRequest,
  ) {
    return this.userManagementService.addNewUser(createUser, req);
  }

  @Post('reset-pass')
  @Roles(UserRole.Admin)
  async resetPass(@Body() password: ResetPassDto) {
    return this.userManagementService.resetPass(password);
  }

  @Put(':id/edit-user')
  @Roles(UserRole.Admin)
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() infoUser: UpdateUserManagementDto,
  ) {
    return this.userManagementService.editUser(id, infoUser);
  }

  @Put(':id/soft-delete-user')
  @Roles(UserRole.Admin)
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userManagementService.softDelete(id);
  }

  @Put(':id/restore-user')
  @Roles(UserRole.Admin)
  restoreUser(@Param('id', ParseIntPipe) id: number) {
    return this.userManagementService.restoreUser(id);
  }
}
