import { injectable } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { Qualification } from '../entities/qualification.entity';

@injectable()
export class QualificationRepository {
  private get repo() {
    return AppDataSource.getRepository(Qualification);
  }

  async findByUserId(userId: string): Promise<Qualification[]> {
    return this.repo.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }
}
