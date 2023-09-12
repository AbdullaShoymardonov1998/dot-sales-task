import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/core/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(query: CreateUserDto) {
    const { name, email, phone } = query;
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            phone,
          },
        ],
      },
    });
    if (existingUser) {
      await this.prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name,
          email,
          phone,
          updatedAt: new Date(),
        },
      });

      const deal = await this.prisma.deal.create({
        data: {
          status: 'First status of the deal',
          contact: {
            connect: { id: existingUser.id },
          },
        },
      });
      return {
        message: 'Updated successfully',
        data: existingUser,
        deal: deal,
      };
    }
    if (!existingUser) {
      const newContact = await this.prisma.user.create({
        data: {
          name,
          email,
          phone,
          createdAt: new Date(),
        },
      });
      const deal = await this.prisma.deal.create({
        data: {
          status: 'First status of the deal',
          contact: {
            connect: { id: newContact.id },
          },
        },
      });
      return {
        message: 'Created successfully',
        data: newContact,
        deal: deal,
      };
    }

    return { data: existingUser };
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }
}
