import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { sequelize } from 'src/config/database';
import { Users } from 'src/config/models/users.model';
import { Op, Sequelize } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import { LoginUserDto, RegisterUserDto } from './dto/users.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Users)
    private usersModel: typeof Users,
    // private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly cats: string[] = [];

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
    // 将加密后的密码存储到数据库中
    try {
      const newUser = await this.usersModel.create(params);
      // 用sign() 生成 JWT token 并返回给前端
      const payload = { username: newUser.username, sub: newUser.id };
      const access_token = this.jwtService.sign(payload);
      return { code: 200, msg: '注册成功', data: null, token: access_token };
    } catch (error) {
      // 错误处理
      if (error.name === 'SequelizeUniqueConstraintError') {
        return { code: 400, msg: '用户名或邮箱已存在', data: null };
      }
      return { code: 500, msg: '服务器错误', data: null };
    }
  }

  //登录
  async login(params: LoginUserDto): Promise<object> {
    // 参数校验
    // const errors = await validate(params);
    // if (errors.length > 0) {
    //   const errorMessages = errors.map((error) =>
    //     Object.values(error.constraints),
    //   );
    //   return { code: 400, msg: errorMessages, data: null };
    // }
    const { username } = params;
    const foundUser = await this.usersModel.findOne({
      where: { username: { [Op.eq]: username } },
    });
    if (!foundUser) {
      return { code: 404, msg: '指定的用户不存在', data: null };
    }
    // const foundUser = await this.usersModel.findOneByUsername(params.username);
    //解密并比较密码
    if (
      foundUser &&
      (await bcrypt.compare(params.password, foundUser.password))
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

    console.log('where:', where);

    const [data, totalCount] = await Promise.all([
      this.usersModel.findAll({ where, limit, offset }),
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
  //新增-带校验、加密
  // async create1(params): Promise<object> {
  //   // 参数校验
  //   const { error } = validateCreateUser(params);
  //   if (error) {
  //     return { code: 400, msg: error.message, data: null };
  //   }
  //   // 数据处理
  //   const { password, ...restParams } = params;
  //   const encryptedPassword = await bcrypt.hash(password, 10);
  //   // 新增操作
  //   try {
  //     const res = await this.usersModel.create({
  //       ...restParams,
  //       password: encryptedPassword,
  //     });
  //     return { code: 200, msg: '新增成功', data: res };
  //   } catch (error) {
  //     // 错误处理
  //     if (error.name === 'SequelizeUniqueConstraintError') {
  //       return { code: 400, msg: '用户名或邮箱已存在', data: null };
  //     }
  //     return { code: 500, msg: '服务器错误', data: null };
  //   }
  // }

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
  async delete(id): Promise<object> {
    let res;
    const user = await this.usersModel.findOne({ where: { id } });
    if (!user) {
      return { code: 404, msg: '指定的用户不存在', data: null };
    }
    if (Array.isArray(id)) {
      // 批量删除
      if (!id.length) return { code: 404, msg: '无效标识', data: null };
      res = await this.usersModel.destroy({
        where: { id: { [Op.in]: id } },
      });
    } else {
      // 单个删除
      if (!id) return { code: 404, msg: '无效标识', data: null };
      res = await this.usersModel.destroy({
        where: { id },
      });
    }
    return { code: 200, msg: '删除成功', data: res };
  }
}
