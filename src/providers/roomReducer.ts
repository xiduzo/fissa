import {Room} from '../lib/interfaces/Room';
import {Track} from '../lib/interfaces/Track';
import {Vote} from '../lib/interfaces/Vote';
import {sortVotes} from '../lib/utils/votes';

interface State {
  room?: Room;
  tracks: Track[];
  votes: {[key: string]: Vote[]};
  pin: string;
}

const action = <T extends string, P = undefined>(type: T, payload: P) => ({
  type,
  payload,
});

export const setVotes = (votes: Vote[]) => action('setVotes', votes);
export const setTracks = (tracks: Track[]) => action('setTracks', tracks);
export const setRoom = (room: Room) => action('setRoom', room);
export const setPin = (pin: string) => action('setPin', pin);

type Action =
  | ReturnType<typeof setVotes>
  | ReturnType<typeof setTracks>
  | ReturnType<typeof setRoom>
  | ReturnType<typeof setPin>;

export const roomReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setVotes':
      return {
        ...state,
        votes: sortVotes(action.payload),
      };
    case 'setTracks':
      return {
        ...state,
        tracks: action.payload,
      };
    case 'setRoom':
      return {
        ...state,
        room: action.payload,
      };
    case 'setPin':
      return {
        ...state,
        pin: action.payload,
      };
    default:
      return state;
  }
};
