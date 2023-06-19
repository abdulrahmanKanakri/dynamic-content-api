import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { Website, WebsiteSchema } from './schema/website.schema';
import { BingAIContentGenerator, IContentGenerator } from './content-generator';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Website.name, schema: WebsiteSchema }]),
  ],
  controllers: [WebsiteController],
  providers: [
    WebsiteService,
    // {
    //   provide: IContentGenerator,
    //   useClass: RandomContentGenerator,
    // },
    // {
    //   provide: IContentGenerator,
    //   useClass: ChatGPTContentGenerator,
    // },
    {
      provide: IContentGenerator,
      useClass: BingAIContentGenerator,
    },
  ],
})
export class WebsiteModule {}
