import { GenerateContentDto } from '../dto';
import { WebsiteContent } from '../types';

export interface IContentGenerator {
  generate(dto: GenerateContentDto): Promise<WebsiteContent>;
}

export const IContentGenerator = Symbol('IContentGenerator');
