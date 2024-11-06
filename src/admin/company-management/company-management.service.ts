import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { createNewCompany } from './dto/create-company-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
import { updateCompany } from './dto/update-company.dto';
import { Company } from '@prisma/client';
@Injectable()
export class CompanyManagementService {
  constructor(private readonly prismaService: PrismaService) {}

  async createNewUser(
    addCompanyDto: createNewCompany,
    @Req() req: CustomRequest,
  ): Promise<{ message: string; data: Company }> {
    try {
      const newCompany = await this.prismaService.company.create({
        data: addCompanyDto,
      });
      return {
        message: 'Company created successfully',
        data: newCompany,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCompany(
    id: number,
    @Body() updateCompanyDto: updateCompany,
  ): Promise<{ data: Company; message: string }> {
    try {
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

      return { data: result, message: 'Updated company successfully' };
    } catch (error) {
      throw new HttpException(
        { message: 'Error creating company', err: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDelete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await this.prismaService.company.update({
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
        where: { id },
      });

      return { success: true, message: 'soft delete successfully' };
    } catch (error) {
      throw new HttpException(
        { message: 'Error creating company', err: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCompany(): Promise<{ data: Company[]; message: string }> {
    try {
      const companyData = await this.prismaService.company.findMany({
        where: { isDeleted: false },
      });
      return { data: companyData, message: 'Company created successfully' };
    } catch (error) {
      throw new HttpException(
        { message: 'Error creating company', err: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restoreCompany(
    id: number,
  ): Promise<{ success: boolean; message: string; data: Company }> {
    try {
      const company = this.prismaService.company.findUnique({ where: { id } });
      if (!company) {
        throw new HttpException(
          { message: `Company with ${id} not exist` },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.prismaService.company.update({
        data: {
          isDeleted: false,
          deletedAt: null,
        },
        where: { id },
      });
      return {
        success: true,
        data: result,
        message: 'Updated company successfully',
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Error creating company', err: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
