import { container } from 'tsyringe';
import { useContainer } from 'routing-controllers';
import { UserRepository } from './modules/users/repositories/user.repository';
import { SkillRepository } from './modules/users/repositories/skill.repository';
import { QualificationRepository } from './modules/users/repositories/qualification.repository';
import { ExperienceRepository } from './modules/users/repositories/experience.repository';
import { UserService } from './modules/users/services/user.service';
import { UserController } from './modules/users/controllers/user.controller';
import { HealthCheckController } from './modules/health/health.controller';

useContainer({ get: (token: any) => container.resolve(token) });

container.registerSingleton(UserRepository);
container.registerSingleton(SkillRepository);
container.registerSingleton(QualificationRepository);
container.registerSingleton(ExperienceRepository);
container.registerSingleton(UserService);
container.registerSingleton(UserController);
container.registerSingleton(HealthCheckController);

export { container };
