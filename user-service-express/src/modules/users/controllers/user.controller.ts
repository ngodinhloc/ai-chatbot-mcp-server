import { injectable } from 'tsyringe';
import { JsonController, Get, Param } from 'routing-controllers';
import { UserService } from '../services/user.service';

@injectable()
@JsonController('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id/profile')
  getProfile(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Get('/:id/skills')
  getSkills(@Param('id') id: string) {
    return this.userService.getSkills(id);
  }

  @Get('/:id/qualifications')
  getQualifications(@Param('id') id: string) {
    return this.userService.getQualifications(id);
  }

  @Get('/:id/experience')
  getExperience(@Param('id') id: string) {
    return this.userService.getExperience(id);
  }
}
