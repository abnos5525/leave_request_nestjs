import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  MaxDate,
  Validate,
} from 'class-validator';
import { ActivationStatus } from '../common/types/global';
import { mobileNumberRegex, nationalCodeRegex } from '../common/utils/regex';
import { IsPoint } from '../common/validations/is-point';
import { GeoPointDto } from '../dto/geo-point.dto';
import { GeoLineString, GeoPoint } from '../common/types/geometry';
import { IsLineString } from '../common/validations/is-line-string';
import { GeoLinestringDto } from '../dto/geo-linestring.dto';

@Entity('sample')
export class SampleEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ required: false, readOnly: true })
  id: number;

  @Column()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @Column({ default: ActivationStatus.ACTIVE })
  @IsNotEmpty()
  @IsEnum(ActivationStatus)
  @ApiProperty({
    enum: ActivationStatus,
  })
  status: ActivationStatus;

  @Column()
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isMarried: boolean;

  @Column()
  @IsNotEmpty()
  @Matches(nationalCodeRegex)
  @ApiProperty()
  nationalCode: string;

  @Column()
  @IsOptional()
  @Matches(mobileNumberRegex)
  @ApiProperty({ required: false })
  mobileNumber: string;

  @Column()
  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  @ApiProperty({ required: false })
  birthday: Date;

  @Column()
  @ApiProperty({ required: false })
  profileImg: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Index({ spatial: true })
  @IsNotEmpty()
  @Validate(IsPoint)
  @ApiProperty({ type: GeoPointDto })
  location: GeoPoint;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LINESTRING',
    srid: 4326,
  })
  @Index({ spatial: true })
  @IsNotEmpty()
  @Validate(IsLineString)
  @ApiProperty({ type: GeoLinestringDto })
  path: GeoLineString;

  @Column()
  @RelationId((sampleEntity: SampleEntity) => sampleEntity.parent)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  parentId: number;

  @ManyToOne(() => SampleEntity)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  @ApiProperty({ required: false, readOnly: true })
  parent: SampleEntity;

  @CreateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ required: false, readOnly: true })
  updatedAt: Date;
}
