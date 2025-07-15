import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { LookupDiscriminator } from 'src/common/types/lookup';

@Index('lookup_pkey', ['id'], { unique: true })
@Index('lookup_discriminator_content_unique', ['discriminator', 'content'], {
  unique: true,
})
@Entity('lookup', { schema: 'public' })
export class LookupEntity {
  @ApiProperty({ readOnly: true })
  @Column('integer', { primary: true, name: 'id', generated: 'increment' })
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LookupDiscriminator)
  @Column('character varying', { name: 'discriminator', length: 255 })
  discriminator: LookupDiscriminator;

  @ApiProperty({ required: false })
  @Column('character varying', { name: 'content', nullable: true, length: 255 })
  content: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 255,
  })
  description: string | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Column('smallint', { name: 'order_item', nullable: true })
  order_item: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Column('integer', { name: 'parent_id', nullable: true })
  parent_id: number | null;

  @ApiProperty({ required: false })
  @Column('character varying', { name: 'icon', nullable: true, length: 255 })
  icon: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', { name: 'color', nullable: true, length: 255 })
  color: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'font_color',
    nullable: true,
    length: 255,
  })
  font_color: string | null;

  @ApiProperty({ required: false })
  @Column('character varying', {
    name: 'url',
    nullable: true,
    length: 255,
  })
  url: string | null;

  @ApiProperty({ required: false })
  @Column('text', { name: 'additional_detail', nullable: true })
  additional_detail: string | null;

  @ApiProperty({ required: false, readOnly: true })
  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 255,
  })
  created_by: string | null;

  @CreateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  @Column('timestamp without time zone', { name: 'created_at', nullable: true })
  created_at: Date | null;

  @ApiHideProperty()
  @ManyToOne(() => LookupEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent_lookup: LookupEntity | null;
}
