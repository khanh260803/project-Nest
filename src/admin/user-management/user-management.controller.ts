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

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('add-user')
  async addNewUser(@Body() createUser: CreateUserManagementDto) {
    return this.userManagementService.addNewUser(createUser);
  }
  @Post('reset-pass')
  async resetPass(@Body() password: ResetPassDto) {
    return this.userManagementService.resetPass(password);
  }
  @Put(':id/edit-user')
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() infoUser: UpdateUserManagementDto,
  ) {
    return this.userManagementService.editUser(id, infoUser);
  }
  @Put(':id/soft-delete-user')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userManagementService.softDelete(id);
  }

  @Put(':id/restore-user')
  restoreUser(@Param('id', ParseIntPipe) id: number) {
    return this.userManagementService.restoreUser(id);
  }
}
