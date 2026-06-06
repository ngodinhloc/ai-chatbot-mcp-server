import { injectable } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { User } from '../entities/user.entity';

@injectable()
export class UserRepository {
  private get repo() {
    return AppDataSource.getRepository(User);
  }

  async findById(userId: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id: userId },
      select: ['id', 'firstName', 'lastName', 'email', 'bio', 'avatarUrl', 'createdAt', 'updatedAt'],
    });
  }

  async existsById(userId: string): Promise<boolean> {
    return this.repo.existsBy({ id: userId });
  }
}
