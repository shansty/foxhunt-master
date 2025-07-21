import { MemoryRouter } from 'react-router-dom';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { HeaderLogo, HeaderLogoProps } from '../HeaderLogo';

export default {
  title: 'HeaderLogo',
  component: HeaderLogo,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof HeaderLogo>;

const Template: ComponentStory<typeof HeaderLogo> = (args: HeaderLogoProps) => (
  <HeaderLogo {...args} />
);

export const EmptyTitle = Template.bind({});
export const PortalTitle = Template.bind({});

EmptyTitle.args = {};

PortalTitle.args = {
  portalName: 'Foxhunt Admin Portal',
};
