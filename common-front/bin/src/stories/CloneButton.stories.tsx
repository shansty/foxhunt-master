import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  CloneButton,
  CloneButtonProps,
} from '../ManagementButtons/CloneButton';

export default {
  title: 'CloneButton',
  component: CloneButton,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof CloneButton>;

const Template: ComponentStory<typeof CloneButton> = (
  args: CloneButtonProps,
) => {
  return <CloneButton {...args} />;
};

export const DefaultButton = Template.bind({});

DefaultButton.args = {
  onClick: () => {
    console.log('onCloneClick');
  },
};
