import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { sequelize } from 'src/config/database';
import { Users } from 'src/config/models/users.model';
import { Op, Sequelize } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { LoginUserDto, RegisterUserDto } from './dto/users.dto';
//
import { adminMenu } from 'src/config/data/adminMenu';
import { userMenu } from 'src/config/data/userMenu';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
    private readonly jwtService: JwtService,
  ) {}

  //获取菜单
  async getMenu(req, params): Promise<object> {
    const { username } = req.user;
    const foundUser = await this.usersModel.findOne({
      where: { username: { [Op.eq]: username } },
    });
    let res = userMenu;
    if (foundUser.role === 'admin') {
      res = adminMenu;
    }
    return { code: 200, msg: '用户菜单', data: res, role: foundUser.role };
    // return { data: res, role: foundUser.role };
  }

  //注册
  async register(params): Promise<object> {
    const { username } = params;
    const foundUser = await this.usersModel.findOne({
      where: { username: { [Op.eq]: username } },
    });
    if (foundUser) {
      return { code: 404, msg: '用户已存在', data: null };
    }

    // 对用户密码进行加密处理
    params.password = await bcrypt.hash(params.password, 10);
    if (!params['role'] && params['username'] === 'admin') {
      params['role'] = 'admin';
    } else if (!params['role'] && params['username'] !== 'admin') {
      params['role'] = 'user';
    }
    try {
      const newUser = await this.usersModel.create(params);
      // 用sign() 生成 JWT token 并返回给前端
      const payload = { username: newUser.username, sub: newUser.id };
      const access_token = this.jwtService.sign(payload);
      return { code: 200, msg: '注册成功', data: null, token: access_token };
    } catch (error) {
      // 错误处理
      if (error.name === 'SequelizeUniqueConstraintError') {
        return { code: 400, msg: '用户名或邮箱已存在', data: error };
      }
      return { code: 500, msg: '服务器错误', data: error };
    }
  }

  //登录
  async login(params: LoginUserDto): Promise<object> {
    const { username } = params;
    const foundUser = await this.usersModel.findOne({
      where: { username: { [Op.eq]: username } },
    });
    if (!foundUser) {
      return { code: 404, msg: '指定的用户不存在', data: null };
    }

    // const foundUser = await this.usersModel.findOneByUsername(params.username);
    //解密并比较密码
    // console.log('--password--', params.password, foundUser.password);
    if (
      foundUser &&
      (await bcrypt.compare(`${params.password}`, foundUser.password))
    ) {
      const payload = { username: foundUser.username, sub: foundUser.id };
      const access_token = this.jwtService.sign(payload);
      return { code: 200, msg: '登录成功', data: null, token: access_token };
    } else {
      return { message: '用户名或密码错误' };
    }
  }

  //查询
  async findAll(params): Promise<object> {
    const currentPage = Number(params.currentPage || 1);
    const pageSize = Number(params.pageSize || 10);
    const limit = pageSize; // 每页显示的记录数
    const offset = (currentPage - 1) * pageSize; // 偏移量
    const conditions = [];
    const conditionsOr = [];
    if (params['username']) {
      //   where['username'] = {
      //     [Op.like]: `%${params.username}%`,
      //   };
      conditions.push({ username: { [Op.like]: `%${params.username}%` } });
    }
    if (params['id']) {
      conditions.push({ id: { [Op.eq]: params.id } });
    }
    if (params['nickname']) {
      conditions.push({ nickname: { [Op.like]: `%${params.nickname}%` } });
    }
    if (params['role']) {
      conditions.push({ role: { [Op.eq]: params.role } });
    }
    let where = {};
    if (conditions.length) {
      where = {
        ...where,
        [Op.and]: conditions,
      };
    }
    if (conditionsOr.length) {
      where = {
        ...where,
        [Op.or]: conditionsOr,
      };
    }
    // console.log('where:', where);
    const order: [string, 'ASC' | 'DESC'][] = [['createdAt', 'DESC']]; // 按照 createdAt 字段倒序排序
    const [data, totalCount] = await Promise.all([
      this.usersModel.findAll({ where, limit, offset, order }),
      this.usersModel.count({ where }),
    ]);
    // const data = await Users.findAll({ where, limit, offset });
    // const totalCount = await Users.count(); //数据总数
    const total = data.length;
    return {
      code: 200,
      msg: '获取成功',
      data,
      total,
      totalCount,
    };
  }

  // 根据主键值查找数据库中的记录
  async findById(id: number): Promise<object> {
    const res = await this.usersModel.findByPk(id);
    return { code: 200, msg: '新增成功', data: res };
  }

  //写sql语句方式查询
  //   async findAllOnSql(): Promise<object> {
  //     const [results] = await sequelize.query('SELECT * FROM user');
  //     return { code: 200, msg: '获取成功', data: results };
  //   }

  //新增/注册
  async create(params): Promise<object> {
    const res = await this.usersModel.create(params);
    return { code: 200, msg: '新增成功', data: res };
  }

  //更新
  async update(params): Promise<object> {
    const { id } = params;
    const user = await this.usersModel.findOne({ where: { id } });
    if (!user) {
      return { code: 404, msg: '指定的用户不存在', data: null };
    }
    // 对用户密码进行加密处理
    params.password = await bcrypt.hash(params.password, 10);
    const res = await this.usersModel.update(params, {
      where: { id },
    });
    return { code: 200, msg: '更新成功', data: res };
  }

  //删除
  async delete({ id }): Promise<object> {
    const ids = Array.isArray(id) ? id : [id];
    const user = await this.usersModel.findOne({
      where: { id: { [Op.in]: ids } },
    });
    if (!user) {
      return { code: 404, msg: '指定的用户不存在', data: null };
    }
    if (!ids.length) return { code: 404, msg: '无效标识', data: null };
    const res = await this.usersModel.destroy({
      where: { id: { [Op.in]: ids } },
    });
    return { code: 200, msg: '删除成功', data: res };
  }
}
