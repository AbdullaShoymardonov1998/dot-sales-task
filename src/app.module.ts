import { Module } from '@nestjs/common';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
