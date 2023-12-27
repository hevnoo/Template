import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupOption, Op, Sequelize } from 'sequelize';
import { Request, Response } from 'express';
import { sequelize } from 'src/config/database';
import { Articles } from 'src/config/models/articles.model';
import { Users } from 'src/config/models/users.model';
import { Favorites } from 'src/config/models/favorites.model';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Articles)
    private model: typeof Articles,
    @InjectModel(Users)
    private usersModel: typeof Users,
  ) {}
  //查询
  async findAll(req, params): Promise<object> {
    let limit = null; // 每页显示的记录数
    let offset = null; // 偏移量
    if (params['currentPage'] && params['pageSize']) {
      const currentPage = params.currentPage - 0 || 0;
      const pageSize = params.pageSize - 0 || 0;
      limit = pageSize; // 每页显示的记录数
      offset = (currentPage - 1) * pageSize; // 偏移量
    }
    const order: [string, 'ASC' | 'DESC'][] = [['createdAt', 'DESC']]; // 按照 createdAt 字段倒序排序
    const where = {};
    const where1 = {};
    try {
      if (params.title) {
        // where['title'] = { title: { [Op.eq]: params.title } };
        where['title'] = { [Op.like]: `%${params.title}%` };
      }
      if (params.userId) {
        where['userId'] = { [Op.eq]: `${params.userId}` };
      }
      const { rows: data, count } = await Articles.findAndCountAll({
        where,
        order,
        limit,
        offset,
        include: [
          // 关联查询
          // {
          //   model: Users, // 关联的模型
          //   as: 'user', // 在 Articles 模型中定义的关联名称，例如在 belongsTo 中定义的 as 字段
          //   // attributes: ['username', 'nickname', 'role'], // 指定要选择的属性
          //   where: where1, // 添加 where 条件来限制被关联的信息
          // },
          // 左连接查询
          // {
          //   model: Favorites,
          //   required: false, //左连接
          //   as: 'favorites',
          //   attributes: ['id', 'userId', 'articleId'],
          //   where: { userId: req.user.id },
          // },
        ],
        //用于指定要返回的字段
        attributes: {
          include: [
            // [sequelize.col('user.nickname'), 'nickname'],
            [
              sequelize.literal(`
                (SELECT nickname FROM Users WHERE Users.id = Articles.userId)
              `),
              'userId_string',
            ],
            [
              // 子查询判断文章是否被当前用户收藏
              sequelize.literal(`
                (SELECT id FROM favorites WHERE favorites.articleId = Articles.id AND favorites.userId = '${req.user.id}')
              `),
              'favoriteId',
            ],
            [
              sequelize.literal(`
                IF(
                  EXISTS (
                    SELECT id FROM favorites WHERE favorites.articleId = Articles.id AND favorites.userId = '${req.user.id}'
                  ),
                  TRUE,
                  FALSE
                )
              `),
              'isFavorite',
            ],
            [
              //sql子句literal()——子查询统计文章被收藏数量
              Favorites.sequelize.literal(`
                (SELECT COUNT(*) FROM favorites WHERE Favorites.articleId = Articles.id)
              `),
              'likeCount',
            ],
          ],
        },
        // distinct: true,
        // group: ['Articles.id'],
      });
      // for (let item of data) {
      //   item = item.get();
      //   // item['nickname'] = item['user'] ? item['user']['nickname'] : '';
      // }
      return {
        code: 200,
        msg: '获取成功',
        data: data,
        total: count,
        totalCount: count,
      };
    } catch (err) {
      console.error(err);
      return {
        code: 500,
        msg: '失败',
        error: err.message || '服务器内部错误',
      };
    }
  }
  //新增
  async create(req, params): Promise<object> {
    const { id } = params;
    params['userId'] = req.user.id;
    try {
      // const findRes = await Favorites.findOne({
      //   where: { articleId: { [Op.eq]: id } },
      // });
      // if (findRes) {
      //   throw new Error('已有该记录');
      // }
      delete params.id;
      const result = await sequelize.transaction(async (t) => {
        // 在事务中创建一个新记录
        const createdData = await Articles.create(params, { transaction: t });
        return createdData;
      });
      return {
        code: 200,
        msg: '创建成功',
        data: result.toJSON(),
      };
    } catch (err) {
      console.error(err);
      return {
        code: 500,
        msg: '创建失败',
        error: err.message || '服务器内部错误',
      };
    }
  }
  // 更新
  async update(req, params): Promise<object> {
    const { id } = params;
    // params['userId'] = req.user.id;
    try {
      const findRes = await Articles.findByPk(id);
      if (!findRes) {
        throw new Error('未找到要更新的记录');
      }
      // 在事务中更新记录
      const result = await sequelize.transaction(async (t) => {
        const res = await Articles.update(params, {
          where: { id: id }, // 指定更新的条件
          returning: true, // 返回更新后的记录
          transaction: t,
        });
        return res;
      });
      return {
        code: 200,
        msg: '更新成功',
        data: result,
      };
    } catch (err) {
      console.error(err);
      return {
        code: 500,
        msg: '更新失败',
        error: err.message || '服务器内部错误',
      };
    }
  }
  // 删除
  async delete({ id }): Promise<object> {
    const ids = Array.isArray(id) ? id : [id];
    try {
      const result = await sequelize.transaction(async (t) => {
        // 在事务中删除记录
        const rowsAffected = await Articles.destroy({
          where: { id: { [Op.in]: ids } }, // 指定要删除的记录的条件
          transaction: t,
        });
        if (rowsAffected > 0) {
          return {
            code: 200,
            msg: '删除成功',
          };
        } else {
          throw new Error('未找到要删除的记录');
        }
      });
      return result;
    } catch (err) {
      console.error(err);
      return {
        code: 500,
        msg: '删除失败',
        error: err.message || '服务器内部错误',
      };
    }
  }
  // sql查询
  // async findAll(req, params): Promise<object> {
  //   const currentPage = Number(params.currentPage || 1);
  //   const pageSize = Number(params.pageSize || 10);
  //   const limit = pageSize; // 每页显示的记录数
  //   const offset = (currentPage - 1) * pageSize; // 偏移量
  //   const order = `createdAt DESC`;
  //   let where = ``;
  //   try {
  //     if (params.id) {
  //       where += `id = '${params.id}' AND `;
  //     }
  //     // 如果where字符串不为空，则给它加上WHERE关键字，否则不添加WHERE关键字
  //     if (where.length > 0) {
  //       where = 'WHERE ' + where.slice(0, -5);
  //     }
  //     const sql = `SELECT * FROM articles ${where} order by ${order} limit ${limit} offset ${offset}`;
  //     const [data] = await sequelize.query(sql);
  //     // 查询总记录数
  //     const [totalCount] = await sequelize.query(
  //       'SELECT COUNT(*) AS total FROM articles',
  //     );
  //     /*
  //   使用类型断言，将totalCount断言为一个具有total属性的对象数组。
  //   这是因为sequelize.query方法返回的结果类型是unknown[]，我们需要明确告诉 TypeScript 这个数组的类型
  //   */
  //     const total = (totalCount as { total: number }[])[0].total;
  //     return {
  //       code: 200,
  //       msg: '获取成功',
  //       data,
  //       total,
  //       totalCount: total,
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     return {
  //       code: 500,
  //       msg: '失败',
  //       error: err.message || '服务器内部错误',
  //     };
  //   }
  // }
}
