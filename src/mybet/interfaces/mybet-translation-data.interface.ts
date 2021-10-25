import { MybetButtonInterface } from './mybet-button.interface';
import { MybetHtmlContentInterface } from './mybet-html-content.interface';

/**
 * Translation data interface for message
 * @export
 * @interface MybetTranslationDataInterface
 */
export interface MybetTranslationDataInterface {
  title: string;
  imageUrl: string;
  imageAltText: string;
  description: MybetHtmlContentInterface;
  primaryButton: MybetButtonInterface;
}
