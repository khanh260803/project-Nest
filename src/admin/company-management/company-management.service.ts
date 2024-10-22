import { Body, Injectable, Req } from '@nestjs/common';
import { createNewCompany } from './dto/create-company-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { updateCompany } from './dto/update-company.dto';
@Injectable()
export class CompanyManagementService {
  constructor(private readonly prismaService: PrismaService) {}
  // add new company
  async createNewUser(addCompany: createNewCompany, @Req() req: CustomRequest) {
    await this.prismaService.company.create({
      data: {
        ...addCompany,
      },
    });

    return { message: 'Add company successful' };
  }

  //edit company
  async updateCompany(id: number, @Body() updateCompanyDto: updateCompany) {
    console.log(updateCompanyDto);
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });
    console.log(company);
    const result = await this.prismaService.company.update({
      data: { ...updateCompanyDto },
      where: {
        id,
      },
    });
    return { message: 'Update company successful', result };
  }

  //soft delete company
  async softDelete(id: number) {
    await this.prismaService.company.update({
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
      where: { id },
    });
    return { message: 'soft delete successful' };
  }

  //get all company
  async getAllCompany() {
    const company = await this.prismaService.company.findMany({
      where: { isDeleted: false },
    });
    return { message: 'fetch all user', company };
  }

  async restoreCompany(id: number) {
    await this.prismaService.company.update({
      data: {
        isDeleted: false,
        deletedAt: null,
      },
      where: { id },
    });
    return { message: 'restore company successful' };
  }
}
