import { createUniqueColor, generateRandomColor } from '..';
import chroma from 'chroma-js';

jest.mock('..', () => {
  const actual = jest.requireActual('..');
  return {
    ...actual,
    generateRandomColor: jest.fn(),
  };
});

jest.mock('chroma-js', () => ({
  ...jest.requireActual('chroma-js'),
  deltaE: jest.fn(),
}));

jest.mock('src/constants/mapConst', () => ({
  COMPARE_COLOR_VALUE: 10,
  COMPARE_COLOR_VALUE_MAX: 10,
}));

describe('createUniqueColor', () => {
  beforeEach(() => {
    generateRandomColor.mockClear();
    chroma.deltaE.mockClear();
  });

  it('should generate unique colors (string and perceptually distinct) and contain # with 50 elems', () => {
    const colors = [];
    let mockColorCounter = 0;
    generateRandomColor.mockImplementation(() => {
      return `#${(mockColorCounter++).toString(16).padStart(6, '0')}`;
    });
    chroma.deltaE.mockReturnValue(100);

    for (let i = 0; i < 50; i++) {
      const color = createUniqueColor(colors);

      expect(typeof color).toBe('string');
      expect(color).toContain('#');
      expect(color.length).toBe(7);

      expect(colors).not.toContain(color);

      colors.push(color);
    }
  });
});
