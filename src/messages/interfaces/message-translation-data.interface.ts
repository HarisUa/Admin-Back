import { MessageButtonInterface } from './message-button.interface';
import { MessageHtmlContentInterface } from './message-html-content.interface';

/**
 * Translation data interface for message
 * @export
 * @interface MessageTranslationDataInterface
 */
export interface MessageTranslationDataInterface {
  title: string;
  imageUrl: string;
  imageAltText: string;
  description: MessageHtmlContentInterface;
  primaryButton: MessageButtonInterface;
}
