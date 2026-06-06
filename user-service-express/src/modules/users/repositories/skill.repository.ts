import { injectable } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { Skill } from '../entities/skill.entity';

@injectable()
export class SkillRepository {
  private get repo() {
    return AppDataSource.getRepository(Skill);
  }

  async findByUserId(userId: string): Promise<Skill[]> {
    return this.repo.findBy({ userId });
  }
}
