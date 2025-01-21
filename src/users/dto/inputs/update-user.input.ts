import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsOptional()
  @IsArray()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
