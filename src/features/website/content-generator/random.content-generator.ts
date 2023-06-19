import { Injectable } from '@nestjs/common';

import { GenerateContentDto } from '../dto';
import { WebsiteContent } from '../types';

import { IContentGenerator } from './content-generator.interface';

@Injectable()
export class RandomContentGenerator implements IContentGenerator {
  generate(dto: GenerateContentDto): Promise<WebsiteContent> {
    const data: WebsiteContent = {
      name: dto.name,
      title: dto.title,
      subtitle: 'subtitle',
      description: dto.description,
      introduction: 'introduction',
      keyPoints: [
        {
          title: 'Creative Advertising',
          description:
            'Ultrices leo dictum integer quam nulla morbi adipiscing ac suspendisse neque vel non egestas commodo sit felis consectetur.',
        },
        {
          title: 'Digital Advertising',
          description:
            'Elementum duis volutpat ullamcorper nec elementum in fermentum tortor sed ut nunc nisl ipsum aenean ante.',
        },
        {
          title: 'Traditional',
          description:
            'Risus turpis lacus fusce odio turpis duis vitae volutpat diam malesuada ullamcorper egestas elit, lacus vulputate.',
        },
        {
          title: 'Social Media',
          description:
            'Porttitor leo dictumst ipsum pellentesque nunc, ultricies scelerisque quam volutpat nunc.',
        },
        {
          title: '24 Hrs Access',
          description:
            'This is a short description elaborating the service you have mentioned above.',
        },
      ],
      faqs: [
        {
          question:
            'What factors should I consider when purchasing homeowners insurance?',
          answer:
            'Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet.',
        },
        {
          question: 'Where and when is my personal property covered?',
          answer:
            'Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet.',
        },
        {
          question: 'Do I need earthquake coverage? How can I get it?',
          answer:
            'Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet.',
        },
        {
          question: 'What does homeowners insurance cover?',
          answer:
            'Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet.',
        },
      ],
    };

    return Promise.resolve(data);
  }
}
