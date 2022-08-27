import Discord from 'discord.js';
import {
  formatBidMessageText,
  formatNewGovernanceProposalText,
  formatNewGovernanceVoteText,
  formatProposalAtRiskOfExpiryText,
  formatUpdatedGovernanceProposalStatusText,
  getNounPngBuffer,
} from '../utils';
import {Bid, IAuctionLifecycleHandler, Idea, IIdeaLifecycleHandler, Proposal, Vote} from '../types';

export class DiscordAuctionLifecycleHandler implements IAuctionLifecycleHandler {
  constructor(public readonly discordClients: Discord.WebhookClient[]) {}

  /**
   * Send Discord message with an image of the current noun alerting users
   * @param auctionId The current auction ID
   */
  async handleNewAuction(auctionId: number) {
    const png = await getNounPngBuffer(auctionId.toString());
    if (png) {
      const attachmentName = `Auction-${auctionId}.png`;
      const attachment = new Discord.MessageAttachment(png, attachmentName);
      const message = new Discord.MessageEmbed()
        .setTitle(`New Auction Discovered`)
        .setDescription(`An auction has started for Lil Noun #${auctionId}`)
        .setURL('https://lilnouns.wtf')
        .addField('Lil Noun ID', auctionId, true)
        .attachFiles([attachment])
        .setImage(`attachment://${attachmentName}`)
        .setTimestamp();
      await Promise.all(this.discordClients.map(c => c.send(message)));
    }
    console.log(`processed discord new auction ${auctionId}`);
  }

  /**
   * Send Discord message with new bid event data
   * @param auctionId Noun auction number
   * @param bid Bid amount and ID
   */
  async handleNewBid(auctionId: number, bid: Bid) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Bid Placed`)
      .setURL('https://lilnouns.wtf')
      .setDescription(await formatBidMessageText(auctionId, bid))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new bid ${auctionId}:${bid.id}`);
  }

  async handleNewProposal(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Governance Proposal`)
      .setURL(`https://lilnouns.wtf/vote/${proposal.id}`)
      .setDescription(formatNewGovernanceProposalText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new proposal ${proposal.id}`);
  }

  async handleUpdatedProposalStatus(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`Proposal Status Update`)
      .setURL(`https://lilnouns.wtf/vote/${proposal.id}`)
      .setDescription(formatUpdatedGovernanceProposalStatusText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord proposal update ${proposal.id}`);
  }

  async handleProposalAtRiskOfExpiry(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`Proposal At-Risk of Expiry`)
      .setURL(`https://lilnouns.wtf/vote/${proposal.id}`)
      .setDescription(formatProposalAtRiskOfExpiryText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord proposal expiry warning ${proposal.id}`);
  }

  async handleGovernanceVote(proposal: Proposal, vote: Vote) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Proposal Vote`)
      .setURL(`https://lilnouns.wtf/vote/${proposal.id}`)
      .setDescription(await formatNewGovernanceVoteText(proposal, vote))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new vote for proposal ${proposal.id};${vote.id}`);
  }
}

export class DiscordIdeaLifecycleHandler implements IIdeaLifecycleHandler {
  constructor(public readonly discordClients: Discord.WebhookClient[]) {}

  async handleNewIdea(idea: Idea): Promise<void> {
    const message = new Discord.MessageEmbed()
        .setTitle(`New Prop Lot Idea`)
        .setURL(`https://lilnouns.wtf/ideas/${idea.id}`)
        .setDescription(`A new Prop Lot idea (#${idea.id}) has been created: ${idea.title}`)
        .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new idea ${idea.id}`);
  }

  async handlePopularIdea(idea: Idea): Promise<void> {
    const message = new Discord.MessageEmbed()
        .setTitle(`New Popular Idea`)
        .setURL(`https://lilnouns.wtf/ideas/${idea.id}`)
        .setDescription(`It seems idea #${idea.id} (${idea.title}) got a lot of attention. Please take look!`)
        .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord idea popularity alert ${idea.id}`);
  }
}
