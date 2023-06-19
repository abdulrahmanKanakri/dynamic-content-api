import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GenerateContentDto } from './dto';
import { IContentGenerator } from './content-generator/content-generator.interface';
import { Website } from './schema/website.schema';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<Website>,
    @Inject(IContentGenerator)
    private readonly contentGeneratorService: IContentGenerator,
  ) {}
  async getTargetUsersList(): Promise<string[]> {
    return ['everyone', 'adults', 'kids'];
  }

  async generateContent(
    generateContentDto: GenerateContentDto,
  ): Promise<Website> {
    const content = await this.contentGeneratorService.generate(
      generateContentDto,
    );

    const createdWebsite = new this.websiteModel(content);

    return createdWebsite.save();
  }

  async getWebsiteDetails(id: string): Promise<Website> {
    // should handle not found
    return this.websiteModel.findById(id).exec();
  }
}
