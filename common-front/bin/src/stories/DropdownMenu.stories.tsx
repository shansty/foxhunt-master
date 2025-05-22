import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DropdownMenu, DropdownMenuProps } from '../DropdownMenu';

export default {
  title: 'DropdownMenu',
  component: DropdownMenu,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof DropdownMenu>;

const Template: ComponentStory<typeof DropdownMenu> = (
  args: DropdownMenuProps,
) => {
  return <DropdownMenu {...args} />;
};

export const ZeroItems = Template.bind({});
export const ThreeItems = Template.bind({});
export const LongItems = Template.bind({});

ZeroItems.args = {
  items: [],
};

ThreeItems.args = {
  items: [
    {
      id: 1,
      title: 'Item 1',
    },
    {
      id: 2,
      title: 'Item 2',
    },
    {
      id: 2,
      title: 'Item 3',
    },
  ],
};

LongItems.args = {
  items: [
    {
      id: 1,
      title: "This item shouldn't be here, because it's very long",
    },
    {
      id: 2,
      title: "This item also shouldn't be here, because it's even longer",
    },
    {
      id: 2,
      title:
        'Come on, please remove these extremely long items from the dropdown menu',
    },
  ],
};
