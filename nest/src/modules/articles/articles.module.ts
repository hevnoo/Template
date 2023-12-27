import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Articles } from 'src/config/models/articles.model';
import { Users } from 'src/config/models/users.model';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
  imports: [SequelizeModule.forFeature([Articles, Users])],
})
export class ArticlesModule {}
