import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveButton } from '../ManagementButtons/SaveButton';

export default {
  title: 'SaveButton',
  component: SaveButton,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof SaveButton>;

const Template: ComponentStory<typeof SaveButton> = () => {
  return <SaveButton />;
};

export const DefaultButton = Template.bind({});
