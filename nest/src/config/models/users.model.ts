import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'users',
  timestamps: true, // 默认true。true时会带createdAt、updatedAt字段查表
})
export class Users extends Model {
  @Default(uuidv4) // 设置默认值为 UUID v4
  @Column({
    type: DataType.UUID,
    allowNull: false,
    // autoIncrement: true, //自增
    primaryKey: true, //主键
    unique: true,
  })
  id: string;
  // @Default(DataType.UUIDV4)
  // @PrimaryKey
  // @Column({ type: DataType.UUID, allowNull: false })
  // id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string | number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nickname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;
}
