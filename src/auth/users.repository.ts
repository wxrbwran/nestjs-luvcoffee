import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

// 已废弃
@EntityRepository(User)
export class UserRepository extends Repository<User> {}
