import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { LookupEntity } from './lookup.entity';
import { UserEntity } from './user.entity';

@Index('position_pkey', ['id'], { unique: true })
@Entity('position', { schema: 'public' })
export class PositionEntity {
  @ApiProperty({ required: false, readOnly: true })
  @Column('uuid', { primary: true, name: 'id', generated: 'uuid' })
  id: string;

  @ApiProperty()
  @Column('character varying', {
    name: 'name',
    length: 255,
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'group_name',
    length: 255,
    nullable: true,
  })
  group_name: string | null;

  @IsUUID('4')
  @IsOptional()
  @ApiProperty({ required: false })
  @Column('uuid', { name: 'group_id', nullable: true })
  group_id: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'organization_name',
    length: 255,
    nullable: true,
  })
  organization_name: string | null;

  @ApiProperty({ required: false })
  @Column('bigint', { name: 'organization_id', nullable: true })
  organization_id: string | null;

  @ApiProperty({ readOnly: true })
  @Column('boolean', { name: 'is_organization', nullable: true })
  is_organization: boolean;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'correspondence_title',
    length: 255,
    nullable: true,
  })
  correspondence_title: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'corresponding_code',
    length: 255,
    nullable: true,
  })
  corresponding_code: string | null;

  @ApiProperty()
  @Column('character varying', {
    name: 'username',
    length: 255,
    nullable: false,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @Column('character varying', {
    name: 'first_name',
    length: 255,
    nullable: false,
  })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @Column('character varying', {
    name: 'last_name',
    length: 255,
    nullable: false,
  })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'national_code',
    length: 255,
    nullable: true,
  })
  national_code: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'mobile_number',
    length: 255,
    nullable: true,
  })
  mobile_number: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'phone_number',
    length: 255,
    nullable: true,
  })
  phone_number: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'employment_code',
    length: 255,
    nullable: true,
  })
  employment_code: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'avatar',
    length: 255,
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'sign',
    length: 255,
    nullable: true,
  })
  sign: string | null;

  @ApiProperty({ readOnly: true })
  @Column('boolean', { name: 'is_default', nullable: false })
  is_default = false;

  @ApiProperty({ readOnly: true })
  @Column('boolean', { name: 'is_active', nullable: false })
  is_active = true;

  @IsUUID('4')
  @ApiProperty()
  @Column('uuid', { name: 'fk_user_id', nullable: false })
  fk_user_id: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Column('integer', { name: 'fk_lkp_level_id', nullable: true })
  fk_lkp_level_id: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Column('integer', { name: 'fk_lkp_classification_id', nullable: true })
  fk_lkp_classification_id: number | null;

  @CreateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  @Column('timestamp without time zone', { name: 'created_at', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  @Column('timestamp without time zone', { name: 'updated_at', nullable: true })
  updated_at: Date | null;

  @ApiHideProperty()
  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'fk_user_id', referencedColumnName: 'id' }])
  user: UserEntity;

  @ApiProperty({ required: false, readOnly: true })
  @ManyToOne(() => LookupEntity)
  @JoinColumn([{ name: 'fk_lkp_level_id', referencedColumnName: 'id' }])
  level: LookupEntity;

  @ApiProperty({ required: false, readOnly: true })
  @ManyToOne(() => LookupEntity)
  @JoinColumn([
    { name: 'fk_lkp_classification_id', referencedColumnName: 'id' },
  ])
  classification: LookupEntity;
}
