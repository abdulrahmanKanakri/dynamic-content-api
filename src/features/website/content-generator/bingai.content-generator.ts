import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GenerateContentDto } from '../dto';
import { FAQItem, KeyPointItem, WebsiteContent } from '../types';

import { IContentGenerator } from './content-generator.interface';

@Injectable()
export class BingAIContentGenerator implements IContentGenerator {
  constructor(private readonly configService: ConfigService) {}

  async generate(dto: GenerateContentDto): Promise<WebsiteContent> {
    const bing = await this.getBingChat();

    const api = new bing.BingChat({
      cookie: this.configService.get<string>('BING_COOKIE'),
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

  private async getBingChat(): Promise<any> {
    return (await eval('import("bing-chat")')) as Promise<
      typeof import('bing-chat')
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

      return (res.text as string)
        .split('\n')
        .filter((item) => item.length > 0)
        .reduce((a, b) => (a.length < b.length ? a : b))
        .replace(/[-_*:+]/g, '')
        .trim();
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

      return (res.text as string)
        .replace(/[*\[\]^-_"']/g, '')
        .split('\n')
        .reduce((a, b) => (a.length > b.length ? a : b));
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
      const message = 'list 5 key points with title for ' + dto.description;

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
    let faqs: FAQItem[] = [];

    try {
      const questions = await this.generateQuestions(api, dto);

      faqs = questions.map((question: string) => ({
        question,
        answer: 'Answer',
      }));
    } catch (err) {
      console.log({ err });
    }

    try {
      faqs = await Promise.all(
        faqs.map(async ({ question }: FAQItem) => {
          const answer = await this.generateAnswer(api, question);
          return { question, answer };
        }),
      );

      return faqs;
    } catch (err) {
      console.log({ err });
    }

    return faqs;
  }

  private async generateQuestions(
    api: any,
    dto: GenerateContentDto,
  ): Promise<string[]> {
    const message = 'write 5 FAQ for ' + dto.description;

    const res = await api.sendMessage(message);

    return (res.text as string)
      .replace(/[*\[\]^-_]/g, '')
      .split('\n')
      .filter((item: string) => item.length > 0 && !isNaN(+item[0]))
      .map((item: string) =>
        item
          .replace(/[\d.]/g, '') // remove numbers
          .replace(/https?:\/\/.*?[\s+]/g, '') // remove links
          .trim(),
      );
  }

  private async generateAnswer(api: any, question: string): Promise<string> {
    const res = await api.sendMessage(`${question} without extra information`);

    return (res.text as string).replace(/[*\[\]^-_\d]/g, '');
  }
}
