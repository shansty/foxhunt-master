import { MemoryRouter } from 'react-router-dom';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PageTitle, PageTitleProps } from '../PageTitle';
import { FavIcon } from '../FavIcon';

export default {
  title: 'PageTitle',
  component: PageTitle,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PageTitle>;

const Template: ComponentStory<typeof PageTitle> = (args: PageTitleProps) => {
  return <PageTitle {...args} />;
};

export const StringTitle = Template.bind({});
export const ElementTitle = Template.bind({});
export const TitleWithStatus = Template.bind({});
StringTitle.args = {
  titleHeading: 'Text Title',
  titleDescription: 'Text Description',
};

ElementTitle.args = {
  titleContent: (
    <>
      {'Content Title'}
      <FavIcon
        starSelected={true}
        handleToggle={() => {
          console.log('handleToggle');
        }}
      />
    </>
  ),
  descriptionContent: (
    <>
      {'Content Description'}
      <div style={{ fontWeight: 'bold' }}>{'02/03/2009'}</div>
    </>
  ),
};

TitleWithStatus.args = {
  titleHeading: 'Text Title',
  titleDescription: 'Text Description',
  titleStatus: 'Text Status',
};
