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

type ActionWithPayload<T extends string, P = undefined> = (payload: P) => {
  type: T;
  payload: P;
};

type ActionWithoutPayload<T extends string> = () => {
  type: T;
};

export const setVotes: ActionWithPayload<'setVotes', Vote[]> = votes => ({
  type: 'setVotes',
  payload: votes,
});

export const clear: ActionWithoutPayload<'clear'> = () => ({
  type: 'clear',
});

export const setTracks: ActionWithPayload<'setTracks', Track[]> = tracks => ({
  type: 'setTracks',
  payload: tracks,
});

export const setRoom: ActionWithPayload<'setRoom', Room> = room => ({
  type: 'setRoom',
  payload: room,
});

export const setPin: ActionWithPayload<'setPin', string> = pin => ({
  type: 'setPin',
  payload: pin,
});

type Action =
  | ReturnType<typeof setVotes>
  | ReturnType<typeof clear>
  | ReturnType<typeof setTracks>
  | ReturnType<typeof setRoom>
  | ReturnType<typeof setPin>;

export const roomReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'clear':
      return {
        ...state,
        tracks: [],
        votes: {},
      };
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
