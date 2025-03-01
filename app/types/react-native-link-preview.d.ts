declare module 'react-native-link-preview' {
  interface LinkPreviewData {
    title?: string;
    description?: string;
    images?: string[];
    url?: string;
  }

  export function getLinkPreview(url: string): Promise<LinkPreviewData>;
} 