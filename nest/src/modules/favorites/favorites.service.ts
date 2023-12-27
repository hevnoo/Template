import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Request, Response } from 'express';
import { sequelize } from 'src/config/database';
import * as dayjs from 'dayjs';
import { Favorites } from 'src/config/models/favorites.model';
import { Users } from 'src/config/models/users.model';
import { Articles } from 'src/config/models/articles.model';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorites)
    private model: typeof Favorites,
    @InjectModel(Users)
    private usersModel: typeof Users,
    @InjectModel(Articles)
    private articlesModel: typeof Articles,
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
      if (params.userId) {
        where['userId'] = { [Op.eq]: `${params.userId}` };
      }
      if (params.articleId) {
        where['articleId'] = { [Op.eq]: `${params.articleId}` };
      }
      const { rows: data, count } = await Favorites.findAndCountAll({
        where,
        order,
        limit,
        offset,
        include: [],
        attributes: {
          include: [
            [
              sequelize.literal(`
                (SELECT nickname FROM Users WHERE Users.id = Favorites.userId)
              `),
              'userId_string',
            ],
            [
              sequelize.literal(`
                (SELECT title FROM Articles WHERE Articles.id = Favorites.articleId)
              `),
              'articleId_string',
            ],
          ],
        },
      });
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
    const { articleId } = params;
    params['userId'] = params['userId'] ? params['userId'] : req.user.id;
    params['articleId'] = params['articleId'];
    params['collectTime'] = dayjs().format('YYYY-MM-DD');
    try {
      const findRes = await Favorites.findOne({
        where: {
          articleId: { [Op.eq]: articleId },
          userId: { [Op.eq]: req.user.id },
        },
      });
      if (findRes) {
        throw new Error('已有该记录');
      }
      delete params.id;
      const result = await sequelize.transaction(async (t) => {
        // 在事务中创建一个新记录
        const createdData = await Favorites.create(params, { transaction: t });
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
    try {
      const findRes = await Favorites.findByPk(id);
      if (!findRes) {
        throw new Error('未找到要更新的记录');
      }
      // 在事务中更新记录
      const result = await sequelize.transaction(async (t) => {
        const res = await Favorites.update(params, {
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
        const rowsAffected = await Favorites.destroy({
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
}
