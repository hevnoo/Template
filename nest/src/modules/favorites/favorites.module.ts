import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorites } from 'src/config/models/favorites.model';
import { Users } from 'src/config/models/users.model';
import { Articles } from 'src/config/models/articles.model';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
  imports: [SequelizeModule.forFeature([Favorites, Users, Articles])],
})
export class FavoritesModule {}
