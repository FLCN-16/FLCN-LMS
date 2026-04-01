import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { BillingService } from './billing.service';

@Controller({
  path: 'billing',
  version: '1',
})
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('institute/:instituteId')
  findByInstitute(@Param('instituteId') instituteId: string) {
    return this.service.findByInstitute(instituteId);
  }

  @Post()
  create(@Body() dto: CreateBillingDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBillingDto) {
    return this.service.update(id, dto);
  }
}
