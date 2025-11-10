import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { StaffController } from './staff.controller'; // Disabled due to compilation errors
import { StaffService } from './staff.service';
import { Staff } from './entities/staff.entity';
import { StaffRole } from './entities/staff-role.entity';
import { StaffRoleAssignment } from './entities/staff-role-assignment.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { NotificationModule } from '@/modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      StaffRole,
      StaffRoleAssignment,
      User,
    ]),
    NotificationModule,
  ],
  controllers: [/* StaffController */], // Disabled due to compilation errors
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}