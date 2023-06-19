import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

import { FAQItem, KeyPointItem } from '../types';

export type WebsiteDocument = HydratedDocument<Website>;

@Schema()
export class Website {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  introduction: string;

  @Prop({ required: true })
  keyPoints: KeyPointItem[];

  @Prop({ required: true })
  faqs: FAQItem[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const WebsiteSchema = SchemaFactory.createForClass(Website);
