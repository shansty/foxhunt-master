import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CustomTableRow, {
  CustomTableRowProps,
} from '../container/FeatureManagmentPage/components/CustomTableRow';

export default {
  title: 'CustomTableRow',
  component: CustomTableRow,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof CustomTableRow>;

const Template: ComponentStory<typeof CustomTableRow> = (
  args: CustomTableRowProps,
) => {
  return <CustomTableRow {...args} />;
};

export const Row = Template.bind({});

Row.args = {
  feature: {
    id: 1,
    name: 'Test name',
    description: 'Test description',
    isGlobalyEnabled: false,
  },
  updateFeature: () => new Promise((resolve) => {}),
};
