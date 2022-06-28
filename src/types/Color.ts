type Theme = {
  name: string;
  main: string;
  dark: string;
  light: string;
  gradient: {
    colors: [string, string];
    start: {x: number; y: number};
    end: {x: number; y: number};
  };
};

const pinkey: Theme = {
  name: 'pinkey',
  main: '#FF5FE5',
  dark: '#150423',
  light: '#FFCAF7',
  gradient: {
    colors: ['#FF5FE5', '#FF5F72'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
};

const orangy: Theme = {
  name: 'orangy',
  main: '#FF5F5F',
  dark: '#1C0A00',
  light: '#FFC9C9',
  gradient: {
    colors: ['#FF5F5F', '#FF995F'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
};

const greeny: Theme = {
  name: 'greeny',
  main: '#5FFF95',
  dark: '#021600',
  light: '#CBFFE3',
  gradient: {
    colors: ['#5FFF95', '#5FFFEC'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
};

const blueey: Theme = {
  name: 'blueey',
  main: '#5FB2FF',
  dark: '#001428',
  light: '#CBF9FF',
  gradient: {
    colors: ['#5FB2FF', '#18FFF1'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
};

const sunny: Theme = {
  name: 'sunny',
  main: '#FFAD33',
  dark: '#241800',
  light: '#FFC9C9',
  gradient: {
    colors: ['#FFBF5F', '#DFFF5F'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
};

const limey: Theme = {
  name: 'limey',
  main: '#CCFF5F',
  dark: '#0B1A00',
  light: '#FFFED9',
  gradient: {
    colors: ['#FFF95F', '#BCFF4E'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
};

const colors = [sunny, limey, blueey, pinkey, orangy, greeny];

const {floor, random} = Math;
console.log(colors, floor, random);

export const Color = pinkey;
// export const Color: Theme = colors[floor(random() * colors.length)];
