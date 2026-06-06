import { injectable } from 'tsyringe';
import { User } from '../entities/user.entity';
import { Skill } from '../entities/skill.entity';
import { Qualification } from '../entities/qualification.entity';
import { Experience } from '../entities/experience.entity';
import { UserRepository } from '../repositories/user.repository';
import { SkillRepository } from '../repositories/skill.repository';
import { ExperienceRepository } from '../repositories/experience.repository';
import { QualificationRepository } from '../repositories/qualification.repository';
import { NotFoundError } from '../../../common/errors/app-error';

@injectable()
export class UserService {
  constructor(
    private readonly profileRepository: UserRepository,
    private readonly skillRepository: SkillRepository,
    private readonly qualificationRepository: QualificationRepository,
    private readonly experienceRepository: ExperienceRepository,
  ) {}

  private async assertUserExists(userId: string): Promise<void> {
    const exists = await this.profileRepository.existsById(userId);
    if (!exists) throw new NotFoundError(`User ${userId} not found`);
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.profileRepository.findById(userId);
    if (!user) throw new NotFoundError(`User ${userId} not found`);
    return user;
  }

  async getSkills(userId: string): Promise<Skill[]> {
    await this.assertUserExists(userId);
    return this.skillRepository.findByUserId(userId);
  }

  async getQualifications(userId: string): Promise<Qualification[]> {
    await this.assertUserExists(userId);
    return this.qualificationRepository.findByUserId(userId);
  }

  async getExperience(userId: string): Promise<Experience[]> {
    await this.assertUserExists(userId);
    return this.experienceRepository.findByUserId(userId);
  }
}
