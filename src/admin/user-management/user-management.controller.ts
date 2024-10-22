import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { CreateUserManagementDto } from './dto/create-user-management.dto';
import { UpdateUserManagementDto } from './dto/update-user-management.dto';
import { ResetPassDto } from './dto/reset-password.dto';
import { Roles } from 'src/authentication/middlewares/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('add-user')
  @Roles(UserRole.Admin)
  async addNewUser(@Body() createUser: CreateUserManagementDto) {
    return this.userManagementService.addNewUser(createUser);
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
