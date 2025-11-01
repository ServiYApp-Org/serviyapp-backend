import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// módulos principales
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { ServicesModule } from './modules/services/services.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ServiceOrdersModule } from './modules/service-orders/service-orders.module';
import { LocationsModule } from './modules/locations/locations.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get('typeorm');
        if (!config) {
          throw new Error('❌ No se pudo cargar la configuración de TypeORM');
        }
        return config;
      },
    }),

    AuthModule,
    UsersModule,
    ProvidersModule,
    ServicesModule,
    CategoriesModule,
    ServiceOrdersModule,
    LocationsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
