import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import MapLegend from 'src/components/UI/MapLegend';


const meta: Meta<typeof MapLegend> = {
  title: 'MapLegend',
  component: MapLegend,
};
export default meta;

type Story = StoryObj<typeof MapLegend>;

export const EmptyArgs: Story = {};
export const ColumnDirection: Story = {
  args: { direction: 'column' },
};
export const RowDirection: Story = {
  args: { direction: 'row' },
};
export const TitleMargin: Story = {
  args: { titleStyles: { fontSize: '2rem', marginBottom: '1rem' } },
};