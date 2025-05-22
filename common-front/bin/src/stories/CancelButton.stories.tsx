import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  CancelButton,
  CancelButtonProps,
} from '../ManagementButtons/CancelButton';

export default {
  title: 'CancelButton',
  component: CancelButton,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof CancelButton>;

const Template: ComponentStory<typeof CancelButton> = (
  args: CancelButtonProps,
) => {
  return <CancelButton {...args} />;
};

export const DefaultButton = Template.bind({});

DefaultButton.args = {
  onClick: () => {
    console.log('onCancelClick');
  },
};
