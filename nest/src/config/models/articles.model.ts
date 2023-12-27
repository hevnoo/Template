import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
// import { sequelize } from 'src/config/database';
import { Users } from './users.model'; //外表
import { Favorites } from './favorites.model';

@Table({ tableName: 'articles', timestamps: true })
export class Articles extends Model<Articles> {
  // @PrimaryKey
  // @AutoIncrement
  @Default(uuidv4) // 设置默认值为 UUID v4
  @Column({
    type: DataType.UUID,
    allowNull: false,
    // autoIncrement: true, //自增
    primaryKey: true, //主键
    unique: true,
  })
  public id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  public content!: string;

  //文章作者id-外键
  @ForeignKey(() => Users)
  @Default(uuidv4)
  @Column({ type: DataType.UUID, allowNull: false })
  public userId!: string;

  //创建一个名为 author 的属性，用于访问与 Users 模型关联的作者信息。
  @BelongsTo(() => Users)
  public user!: Users;

  //一对多-可使用左连接查询
  // @HasMany(() => Favorites)
  // favorites: Favorites;
  @HasMany(() => Favorites, { foreignKey: 'articleId', as: 'favorites' })
  public favorites!: Favorites[];

  // @ForeignKey(() => Tag)
  // @Column(DataType.INTEGER.UNSIGNED)
  // public tagId!: number;

  // @BelongsTo(() => Tag)
  // public tag!: Tag;

  @Column({ type: DataType.STRING })
  public category!: string;

  //阅读量-通过查询创建
  // @Column({ type: DataType.INTEGER.UNSIGNED })
  // public viewCount!: number;

  //点赞数-通过查询创建
  // @Column({ type: DataType.INTEGER.UNSIGNED })
  // public likeCount!: number;

  // @Column({ type: 'integer', field: 'likeCount' })
  // public favoritesCount!: number;
}

// async function syncModels() {
//   try {
//     await Article.sync({ force: true });
//   } catch (error) {
//     console.error('模型同步失败', error);
//   }
// }
// syncModels();

export default Articles;

/*
1.
@BelongsTo(() => Users) 是 Sequelize 框架中的一个装饰器，用于定义模型之间的关联关系。在这个特定的例子中，它表示 Article 模型属于 User 模型。
通过使用 @BelongsTo 装饰器，我们可以在 Article 模型中创建一个关联到 User 模型的字段和方法。这样做的好处是，我们可以方便地在查询文章时同时获取作者的信息。
2.
const article = await Article.findByPk(articleId, { include: [User] });
console.log(article.author); // 输出文章的作者信息

*/
