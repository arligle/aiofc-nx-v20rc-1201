import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SampleDto } from './vo/sample.dto';
import { SampleSort } from './vo/sample-sort.dto';
import { SamplePrimitivesDto } from './vo/sample-primitives.dto';
import { SampleQueryParam } from './vo/sample-query.dto';

@Controller('/sample')
export class SampleController {
  @Post()
  async create(@Body() dto: SampleDto) {
    return dto;
  }

  @Post('primitives')
  async primitives(@Body() dto: SamplePrimitivesDto) {
    return dto;
  }

  @Get()
  async get(@Query() dto: SampleQueryParam) {
    return dto;
  }
  @Get()
  async get1111(@Body() dto: SampleDto) {
    console.log(dto);
    return dto;
  }

  @Get('sort')
  async getSort(@Query() dto: SampleSort) {
    return dto;
  }
}
