import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
//外表
import { Users } from './users.model';
import { Articles } from './articles.model';

@Table({
  tableName: 'favorites',
  timestamps: true, // 默认true。true时会带createdAt、updatedAt字段查表
})
export class Favorites extends Model {
  @Default(uuidv4) // 设置默认值为 UUID v4
  @Column({
    type: DataType.UUID,
    allowNull: false,
    // autoIncrement: true, //自增
    primaryKey: true, //主键
    unique: true,
  })
  id: string;

  //外键
  @ForeignKey(() => Users)
  @Default(uuidv4)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  //创建一个名为 user 的属性，用于访问与 Users 模型关联的作者信息。
  @BelongsTo(() => Users)
  public user!: Users;

  @ForeignKey(() => Articles)
  @Default(uuidv4)
  @Column({ type: DataType.UUID, allowNull: false })
  articleId: string;

  @BelongsTo(() => Articles)
  public article!: Articles;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  collectTime: string;
}

export { Articles };
