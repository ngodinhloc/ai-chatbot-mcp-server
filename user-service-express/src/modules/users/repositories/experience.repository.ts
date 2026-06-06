import { injectable } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { Experience } from '../entities/experience.entity';

@injectable()
export class ExperienceRepository {
  private get repo() {
    return AppDataSource.getRepository(Experience);
  }

  async findByUserId(userId: string): Promise<Experience[]> {
    return this.repo.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }
}
