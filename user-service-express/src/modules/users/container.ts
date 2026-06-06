import { container } from 'tsyringe';
import { UserRepository } from './repositories/user.repository';
import { SkillRepository } from './repositories/skill.repository';
import { QualificationRepository } from './repositories/qualification.repository';
import { ExperienceRepository } from './repositories/experience.repository';
import { UserService } from './services/user.service';

container.registerSingleton(UserRepository);
container.registerSingleton(SkillRepository);
container.registerSingleton(QualificationRepository);
container.registerSingleton(ExperienceRepository);
container.registerSingleton(UserService);

export { container };
