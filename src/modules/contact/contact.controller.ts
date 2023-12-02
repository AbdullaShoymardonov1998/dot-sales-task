import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}
  @Get()
  @ApiOperation({ summary: 'Get contact info' })
  @UsePipes(new ValidationPipe())
  async getAll(@Query() query: CreateContactDto) {
    return this.contactService.getAllContacts(query);
  }
}
