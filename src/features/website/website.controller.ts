import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Param,
} from '@nestjs/common';

import { APITransformInterceptor } from 'src/common/interceptors/transform.interceptor';

import { WebsiteService } from './website.service';
import { GenerateContentDto } from './dto';
import { Website } from './schema/website.schema';
import { ConfigService } from '@nestjs/config';

@UseInterceptors(APITransformInterceptor)
@Controller('website')
export class WebsiteController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getHello(@Body('message') message: string): Promise<string> {
    return 'hello, ' + message;
  }

  @Get('target-users')
  async getTargetUsersList(): Promise<string[]> {
    return await this.websiteService.getTargetUsersList();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateContent(
    @Body() generateContentDto: GenerateContentDto,
  ): Promise<Website> {
    return await this.websiteService.generateContent(generateContentDto);
  }

  @Get(':id')
  async getWebsiteDetails(@Param('id') id: string): Promise<Website> {
    return await this.websiteService.getWebsiteDetails(id);
  }
}
