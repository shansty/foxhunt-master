import { createUniqueColor } from '..';

it('result of createUniqueColor will be string and contain # with more than 500 elems', () => {
  const colors = [];
  for (let i = 0; i < 500; i++) {
    const color = createUniqueColor(colors);
    expect(color).toContain('#');
    expect(colors).not.toContain(color);
    colors.push(color);
  }
});
