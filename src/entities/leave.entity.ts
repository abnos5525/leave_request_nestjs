import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('leave', { schema: 'public' })
export class LeaveEntity {
  @ApiProperty({ required: false, readOnly: true })
  @Column('uuid', { primary: true, name: 'id', generated: 'uuid' })
  id: string;

  @ApiProperty()
  @Column('character varying', {
    name: 'process_instance_id',
    length: 255,
    nullable: false,
  })
  processInstanceId: string;

  @ApiProperty()
  @Column('character varying', {
    name: 'employee',
    length: 255,
    nullable: false,
  })
  employee: string;

  @ApiProperty()
  @Column('character varying', {
    name: 'manager',
    length: 255,
    nullable: false,
  })
  manager: string;

  @ApiProperty()
  @Column('timestamp without time zone', {
    name: 'start_date',
    nullable: false,
  })
  startDate: Date;

  @ApiProperty()
  @Column('timestamp without time zone', {
    name: 'end_date',
    nullable: false,
  })
  endDate: Date;

  @ApiProperty()
  @Column('character varying', {
    name: 'leave_type',
    length: 255,
    nullable: false,
  })
  leaveType: string;

  @ApiProperty()
  @Column('character varying', {
    name: 'description',
    length: 1024,
    nullable: false,
  })
  description: string;

  @ApiProperty()
  @Column('integer', {
    name: 'days',
    nullable: false,
  })
  days: number;

  @ApiProperty({ readOnly: true })
  @Column('boolean', {
    name: 'is_active',
    nullable: false,
  })
  is_active = true;

  @CreateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
  })
  created_at: Date | null;

  @UpdateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: true,
  })
  updated_at: Date | null;
}
