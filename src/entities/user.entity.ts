import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Entity('user', { schema: 'public' })
export class UserEntity {
  @ApiProperty({ required: false, readOnly: true })
  @Column('uuid', { primary: true, name: 'id', generated: 'uuid' })
  id: string;

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

  @ApiProperty({ readOnly: true })
  @Column('boolean', { name: 'is_active', nullable: false })
  is_active = true;

  @CreateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  @Column('timestamp without time zone', { name: 'created_at', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  @Column('timestamp without time zone', { name: 'updated_at', nullable: true })
  updated_at: Date | null;
}
