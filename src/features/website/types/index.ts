export type KeyPointItem = {
  title: string;
  description: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type WebsiteContent = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  introduction: string;
  keyPoints: KeyPointItem[];
  faqs: FAQItem[];
};
