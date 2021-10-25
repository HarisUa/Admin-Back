import { PromotionButtonInterface } from './promotion-button.interface';
import { PromotionHtmlContentInterface } from './promotion-html-content.interface';

/**
 * Translation data interface for promotion
 * @export
 * @interface PromotionTranslationDataInterface
 */
export interface PromotionTranslationDataInterface {
  title: string;
  description: PromotionHtmlContentInterface;
  primaryButton: PromotionButtonInterface;
  imageUrl: string;
  imageAltText: string;
  summary: string;
}
