import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './utils/configs/db.config';
import { AdminSeeder } from './utils/seeds/admin.seed';
import {
  Advertisement,
  AvailableColor,
  Banner,
  BodyType,
  Brand,
  CallBack,
  Category,
  Colors,
  ComfortAndConvenience,
  Compare,
  DimensionAndCapacity,
  DynamicContent,
  EngineAndTransmission,
  EntertainmentAndCommunication,
  Exterior,
  Faq,
  Favorite,
  FavoriteComparison,
  FuelAndPerformance,
  Interior,
  Model,
  MotorAndBattery,
  NavItem,
  NavItemChild,
  RatingAndReview,
  SafetyAndFeatures,
  SuspensionSteeringAndBrake,
  Users,
  Variant,
  Vehicle,
  VehicleDetail,
  VehicleRequirement,
} from './utils/entities';
import { AuthModule } from './auths/auth.module';
import { CheckData } from './utils/common';
import { AvailableColorController } from './availableColors/availableColor.controller';
import { BodyTypeController } from './bodyTypes/bodyType.controller';
import { BrandController } from './brands/brand.controller';
import { CallBackController } from './callbacks/callback.controller';
import { CategoryController } from './category/category.controller';
import { ColorController } from './colors/color.controller';
import { FaqController } from './faqs/faq.controller';
import { FavoriteController } from './favorites/favorite.controller';
import { ModelController } from './models/model.controller';
import { RatingReviewController } from './ratingRaviews/ratingReview.controller';
import { UserRequirementController } from './userRequirements/userRequirement.controller';
import { UserController } from './users/user.controller';
import { VariantController } from './variants/variant.controller';
import { VehicleController } from './vehicles/vehicle.controller';
import { AvailableColorService } from './availableColors/availableColor.service';
import { BodyTypeService } from './bodyTypes/bodyType.service';
import { BrandService } from './brands/brand.service';
import { CallBackService } from './callbacks/callback.service';
import { CategoryService } from './category/category.service';
import { ColorService } from './colors/color.service';
import { FaqService } from './faqs/faq.service';
import { FavoriteService } from './favorites/favorite.service';
import { ModelService } from './models/model.service';
import { RatingReviewService } from './ratingRaviews/ratingReview.service';
import { UserRequirementService } from './userRequirements/userRequirement.service';
import { UserService } from './users/user.service';
import { VariantService } from './variants/variant.service';
import { VehicleService } from './vehicles/vehicle.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([
      Users,
      Category,
      BodyType,
      Brand,
      Model,
      Variant,
      Colors,
      Vehicle,
      EngineAndTransmission,
      ComfortAndConvenience,
      DimensionAndCapacity,
      EntertainmentAndCommunication,
      Exterior,
      Interior,
      FuelAndPerformance,
      MotorAndBattery,
      SafetyAndFeatures,
      SuspensionSteeringAndBrake,
      VehicleRequirement,
      VehicleDetail,
      Banner,
      DynamicContent,
      Advertisement,
      NavItem,
      NavItemChild,
      AvailableColor,
      CallBack,
      Faq,
      RatingAndReview,
      Favorite,
      Compare,
      FavoriteComparison,
    ]),
    AuthModule,
  ],
  controllers: [
    AppController,
    AvailableColorController,
    BodyTypeController,
    BrandController,
    CallBackController,
    CategoryController,
    ColorController,
    FaqController,
    FavoriteController,
    ModelController,
    RatingReviewController,
    UserRequirementController,
    UserController,
    VariantController,
    VehicleController,
  ],

  providers: [
    AppService,
    AdminSeeder,
    CheckData,
    AvailableColorService,
    BodyTypeService,
    BrandService,
    CallBackService,
    CategoryService,
    ColorService,
    FaqService,
    FavoriteService,
    ModelService,
    RatingReviewService,
    UserRequirementService,
    UserService,
    VariantService,
    VehicleService,
  ],
})
export class AppModule {}
