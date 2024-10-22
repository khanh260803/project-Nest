import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TagDto } from './dto/create-tag-management.dto';
import { UpdateTagManagementDto } from './dto/update-tag-management.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/custom-request';
@Injectable()
export class TagManagementService {
  constructor(private readonly prisma: PrismaService) {}

  //add tag
  async addTag(tagDto: TagDto, req: CustomRequest) {
    console.log(req.user);
    const { name } = tagDto;
    await this.prisma.tag.create({
      data: {
        name: name,
        createdBy: req.user.id,
      },
    });
    return { message: 'create tag successful' };
  }
  //edit tag
  async editTag(tagDto: TagDto, req: CustomRequest, id: number) {
    const { name } = tagDto;
    console.log(name);
    await this.prisma.tag.update({
      data: { name: name },
      where: { id },
    });
    return { message: 'edit tag successful' };
  }
  //delete topic
  async softDeleteTag(id: number) {
    await this.prisma.tag.update({
      data: { isDeleted: true, deletedAt: new Date() },
      where: { id },
    });
    return { message: 'delete tag successful' };
  }

  async restoreTag(id: number) {
    await this.prisma.tag.update({
      data: { isDeleted: false, deletedAt: null },
      where: { id },
    });
    return { message: 'restore tag successful' };
  }

  async getAllTag() {
    const tag = await this.prisma.tag.findMany({
      where: { isDeleted: false },
    });
    console.log(tag);
    if (tag.length === 0) {
      throw new HttpException({ message: 'No Tag' }, HttpStatus.BAD_REQUEST);
    }
    return { message: 'fetch data tag ', tag };
  }
}
