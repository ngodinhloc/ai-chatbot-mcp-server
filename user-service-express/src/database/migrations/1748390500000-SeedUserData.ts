import { MigrationInterface, QueryRunner } from 'typeorm';

const USER_1_ID = 'a1b2c3d4-0001-0001-0001-000000000001';
const USER_2_ID = 'a1b2c3d4-0002-0002-0002-000000000002';

export class SeedCorrectUserData1748390600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_skills, user_experiences, user_qualifications`);

    await queryRunner.query(`
      INSERT INTO skills (id, user_id, name, level, years_of_experience)
      VALUES
        (gen_random_uuid(), '${USER_1_ID}', 'TypeScript',  'advanced',     4),
        (gen_random_uuid(), '${USER_1_ID}', 'Node.js',     'advanced',     4),
        (gen_random_uuid(), '${USER_1_ID}', 'PostgreSQL',  'intermediate', 3),
        (gen_random_uuid(), '${USER_2_ID}', 'Python',      'expert',       6),
        (gen_random_uuid(), '${USER_2_ID}', 'Machine Learning', 'advanced', 4)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO qualifications (id, user_id, title, institution, field, start_date, end_date, description)
      VALUES
        (gen_random_uuid(), '${USER_1_ID}', 'BSc Computer Science',           'University of Technology', 'Computer Science', '2014-09-01', '2018-06-30', NULL),
        (gen_random_uuid(), '${USER_1_ID}', 'AWS Certified Solutions Architect', 'Amazon Web Services',   'Cloud Computing',  '2022-01-01', '2022-03-15', NULL),
        (gen_random_uuid(), '${USER_2_ID}', 'MSc Data Science',               'State University',         'Data Science',     '2018-09-01', '2020-05-20', NULL)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO experiences (id, user_id, company, position, start_date, end_date, current, description)
      VALUES
        (gen_random_uuid(), '${USER_1_ID}', 'Acme Corp', 'Software Engineer',  '2018-09-01', '2021-12-31', false, 'Built microservices and REST APIs'),
        (gen_random_uuid(), '${USER_1_ID}', 'TechFlow',  'Senior Engineer',    '2022-01-15', NULL,         true,  'Led backend platform team'),
        (gen_random_uuid(), '${USER_2_ID}', 'Insights Co', 'Data Analyst',     '2020-07-01', '2023-06-30', false, 'Built ML pipelines and dashboards'),
        (gen_random_uuid(), '${USER_2_ID}', 'DataPulse', 'ML Engineer',        '2023-07-01', NULL,         true,  'Deployed production recommendation models')
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM skills       WHERE user_id IN ('${USER_1_ID}', '${USER_2_ID}')`);
    await queryRunner.query(`DELETE FROM qualifications WHERE user_id IN ('${USER_1_ID}', '${USER_2_ID}')`);
    await queryRunner.query(`DELETE FROM experiences  WHERE user_id IN ('${USER_1_ID}', '${USER_2_ID}')`);
  }
}
