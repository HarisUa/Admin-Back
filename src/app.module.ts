import { Module } from '@nestjs/common';
​
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
​
import { SharedModule } from '@shared/shared.module';
import { SEQUELIZE_CONFIG } from '@shared/config';
​
import { AuthModule } from './auth/auth.module';
import { BannersModule } from './banners/banners.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { SubBannersModule } from './sub-banners/sub-banners.module';
import { EntertainmentsModule } from './entertainments/entertainments.module';
import { PlacementsModule } from './placements/placements.module';
import { PromotionsModule } from './promotions/promotions.module';
import { RegulationsModule } from './regulations/regulations.module';
import { MessagesModule } from './messages/messages.module';
import { SbBettingModule } from './sb-betting/sb-betting.module';
import { MybetModule } from './mybet/mybet.module';
​
@Module({
  imports: [
    SharedModule,
    SequelizeModule.forRoot(SEQUELIZE_CONFIG.moduleConfig),
    AuthModule,
    BannersModule,
    ProfileModule,
    RolesModule,
    UsersModule,
    SubBannersModule,
    EntertainmentsModule,
    PlacementsModule,
    PromotionsModule,
    RegulationsModule,
    MessagesModule,
    SbBettingModule,
    MybetModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}