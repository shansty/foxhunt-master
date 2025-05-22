import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import FallbackComponent, {
  FallbackComponentProps,
} from 'src/components/FallbackComponent';

export default {
  title: 'FallbackComponent',
  component: FallbackComponent,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div
          style={{
            margin: '20em',
          }}
        >
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof FallbackComponent>;

const Template: ComponentStory<typeof FallbackComponent> = (
  args: FallbackComponentProps,
) => {
  return <FallbackComponent {...args} />;
};

export const CustomArgs = Template.bind({});

CustomArgs.args = {
  resetErrorBoundary: () => {
    console.log('resetErrorBoundary');
  },
};
