import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { DonationsService } from './donations.service';
// import { Prisma } from '@prisma/client';
import { OrderByParams } from '../graphql';
import { DonationCreateInput } from '../@generated/prisma-nestjs-graphql/donation/donation-create.input';
import{ PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub();


@Resolver('Donation')
export class DonationsResolver {

  constructor(private readonly donationsService: DonationsService) {}

  @Mutation('createDonation')
  async create(
      @Args('createDonationInput') 
      createDonationInput: DonationCreateInput  // Prisma.DonationCreateInput
      ) {
    const created =  this.donationsService.create(createDonationInput);

    const total = await this.donationsService.getTotal();

    pubSub.publish('totalUpdated', { totalUpdated: { total }});

    return created;
  }

  
  @Subscription()
  totalUpdated() {
    return pubSub.asyncIterator('totalUpdated');
  }


  @Query('donations')
  findAll(
    @Args('orderBy')
    orderBy?: OrderByParams,
    ) {
    return this.donationsService.findAll(orderBy);
  }


  @Query('donation')
  findOne(@Args('id') id: number) {
    return this.donationsService.findOne({ id });
  }


  @Query('totalDonations')
  totalDonations() {
    return this.donationsService.getTotal();
  }


  // @Mutation('updateDonation')
  // update(@Args('updateDonationInput') updateDonationInput: UpdateDonationInput) {
  //   return this.donationsService.update(updateDonationInput.id, updateDonationInput);
  // }

  // @Mutation('removeDonation')
  // remove(@Args('id') id: number) {
  //   return this.donationsService.remove(id);
  // }
}

