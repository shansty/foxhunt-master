import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MapLegend from 'src/components/UI/MapLegend';

export default {
  title: 'MapLegend',
  component: MapLegend,
} as ComponentMeta<typeof MapLegend>;

const Template: ComponentStory<typeof MapLegend> = (args: any) => {
  return <MapLegend {...args} />;
};

export const EmptyArgs = Template.bind({});
export const ColumnDirection = Template.bind({});
export const RowDirection = Template.bind({});
export const TitleMargin = Template.bind({});

EmptyArgs.args = {};
ColumnDirection.args = {
  direction: 'column',
};
RowDirection.args = {
  direction: 'row',
};
TitleMargin.args = {
  titleStyles: { fontSize: '2rem', marginBottom: '1rem' },
};
