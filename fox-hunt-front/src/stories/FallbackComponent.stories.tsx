import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import FallbackComponent, { FallbackComponentProps } from 'src/components/FallbackComponent';

const meta: Meta<typeof FallbackComponent> = {
  title: 'FallbackComponent',
  component: FallbackComponent,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ margin: '20em' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FallbackComponent>;

export const CustomArgs: Story = {
  args: {
    resetErrorBoundary: () => {
      console.log('resetErrorBoundary');
    },
  },
};
