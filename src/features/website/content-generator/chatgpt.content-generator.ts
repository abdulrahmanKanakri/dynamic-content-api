import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GenerateContentDto } from '../dto';
import { FAQItem, KeyPointItem, WebsiteContent } from '../types';

import { IContentGenerator } from './content-generator.interface';

@Injectable()
export class ChatGPTContentGenerator implements IContentGenerator {
  constructor(private readonly configService: ConfigService) {}

  async generate(dto: GenerateContentDto): Promise<WebsiteContent> {
    const gpt = await this.getChatGPT();

    const api = new gpt.ChatGPTAPI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    const [title, subtitle, introduction, keyPoints, faqs] = await Promise.all([
      this.generateTitle(api, dto),
      this.generateSubtitle(api, dto),
      this.generateIntroduction(api, dto),
      this.generateKeypoins(api, dto),
      this.generateFAQs(api, dto),
    ]);

    console.log('data is done');

    const data: WebsiteContent = {
      name: dto.name,
      title,
      subtitle,
      description: dto.description,
      introduction,
      keyPoints,
      faqs,
    };

    return Promise.resolve(data);
  }

  private async getChatGPT(): Promise<any> {
    return (await eval('import("chatgpt")')) as Promise<
      typeof import('chatgpt')
    >;
  }

  private async generateTitle(
    api: any,
    dto: GenerateContentDto,
  ): Promise<string> {
    console.log('start generateTitle');
    try {
      const message = 'give me a short title for ' + dto.description;

      const res = await api.sendMessage(message);

      return res.text.replace(/["']/g, '');
    } catch (err) {
      console.log({ err });
    }

    return dto.title;
  }

  private async generateSubtitle(
    api: any,
    dto: GenerateContentDto,
  ): Promise<string> {
    console.log('start generateSubtitle');
    try {
      const message = 'give me subtitle for website that is ' + dto.description;

      const res = await api.sendMessage(message);

      return res.text.replace(/["']/g, '');
    } catch (err) {
      console.log({ err });
    }

    return dto.title;
  }

  private async generateIntroduction(
    api: any,
    dto: GenerateContentDto,
  ): Promise<string> {
    console.log('start generateIntroduction');
    try {
      const message =
        'give me an introduction section to use in website that is ' +
        dto.description;

      const res = await api.sendMessage(message);

      return res.text;
    } catch (err) {
      console.log({ err });
    }

    return dto.description;
  }

  private async generateKeypoins(
    api: any,
    dto: GenerateContentDto,
  ): Promise<KeyPointItem[]> {
    console.log('start generateKeypoins');

    try {
      const message =
        'list 5 key points with title about website that is ' + dto.description;

      const res = await api.sendMessage(message);

      const keypoints: KeyPointItem[] = (
        res.text
          .replace(/[*\[\]^-_]/g, '')
          .split('\n')
          .filter((item: string) => item.length > 0 && !isNaN(+item[0]))
          .map((item: string) => item.replace(/[\d.]/g, '').trim()) as string[]
      ).map((item, i) => {
        const sentenceParts = item.split(':');
        if (sentenceParts.length === 1) {
          sentenceParts.unshift(`key point ${i + 1}`);
        }
        const [title, description] = sentenceParts;
        return { title, description };
      });

      return keypoints;
    } catch (err) {
      console.log({ err });
    }

    return [];
  }

  private async generateFAQs(
    api: any,
    dto: GenerateContentDto,
  ): Promise<FAQItem[]> {
    console.log('start generateFAQs');

    try {
      const message = 'list some FAQ with answers for ' + dto.description;

      const res = await api.sendMessage(message);

      const faqs: FAQItem[] = (res.text as string)
        .replace(/[*\[\]^-_]/g, '')
        .split('\n')
        .filter((item) => item.length > 0 && /^[aq]:/i.test(item.trim()))
        .reduce((total, currentValue, currentIndex, arr) => {
          if (currentIndex % 2 === 0) {
            total.push(currentValue + '|' + arr[currentIndex + 1]);
          }
          return total;
        }, [])
        .map((item: string) => {
          const [question, answer] = item
            .split('|')
            .map((item) => item.replace(/^[qa]:/i, '').trim());
          return { question, answer };
        });

      return faqs;
    } catch (err) {
      console.log({ err });
    }

    return [];
  }
}
