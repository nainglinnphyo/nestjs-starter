import { PipeTransform, Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize all string fields in the request body (shallow).
 * Install sanitize-html: `npm i sanitize-html`
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'object') return value;
    const out = Array.isArray(value) ? [] : {};
    for (const k of Object.keys(value)) {
      const v = value[k];
      if (typeof v === 'string')
        (out as any)[k] = sanitizeHtml(v, {
          allowedTags: [],
          allowedAttributes: {},
        });
      else (out as any)[k] = v;
    }
    return out;
  }
}
