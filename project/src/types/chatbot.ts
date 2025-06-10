export interface CollegeData {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  relatedTopics?: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  category?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  query: string;
  icon: string;
}