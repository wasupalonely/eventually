import { Injectable } from '@nestjs/common';
import { CreateInvitationInput, UpdateInvitationInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { Repository } from 'typeorm';
import { GuestsService } from 'src/guests/guests.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly guestsService: GuestsService,
  ) {}

  create(createInvitationInput: CreateInvitationInput) {
    return 'This action adds a new invitation';
  }

  addGuestsToInvitation(guestsId: string[]) {
    // const guests = this.guestsService.findAllByIds(guestsId);
  }

  findAll() {
    return `This action returns all invitations`;
  }

  findOne(id: string) {
    return `This action returns a #${id} invitation`;
  }

  update(id: string, updateInvitationInput: UpdateInvitationInput) {
    return `This action updates a #${id} invitation`;
  }

  remove(id: string) {
    return `This action removes a #${id} invitation`;
  }
}
