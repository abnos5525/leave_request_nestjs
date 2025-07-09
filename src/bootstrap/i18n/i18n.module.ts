import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  I18nModule as I18nextModule,
} from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nextModule.forRoot({
      fallbackLanguage: 'fa',
      loaderOptions: {
        path: path.join(__dirname, '/../../../i18n/'),
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
})
export class I18nModule {}
