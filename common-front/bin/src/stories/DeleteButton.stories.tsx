import { MemoryRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  DeleteButton,
  DeleteButtonProps,
} from '../ManagementButtons/DeleteButton';

export default {
  title: 'DeleteButton',
  component: DeleteButton,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof DeleteButton>;

const Template: ComponentStory<typeof DeleteButton> = (
  args: DeleteButtonProps,
) => {
  return <DeleteButton {...args} />;
};

export const DefaultButton = Template.bind({});

DefaultButton.args = {
  onClick: () => {
    console.log('onDeleteClick');
  },
};
