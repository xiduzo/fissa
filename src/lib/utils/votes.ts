import {Vote} from '../interfaces/Vote';

export const sortVotes = (votes: Vote[]) =>
  votes?.reduce((acc: {[key: string]: Vote[]}, vote: Vote) => {
    acc[vote.trackId] = acc[vote.trackId] || [];
    acc[vote.trackId].push(vote);
    return acc;
  }, {});
