import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Loader, LoaderProps } from '../Loader';

export default {
  title: 'Loader',
  component: Loader,
} as ComponentMeta<typeof Loader>;

const Template: ComponentStory<typeof Loader> = (args: LoaderProps) => {
  return <Loader {...args} />;
};

const ChildComponent = () => <p>Child test component</p>;
const SecondChildComponent = () => <span>Second child component</span>;

export const CustomLoader = Template.bind({});
export const FinishedLoading = Template.bind({});
export const IsLoading = Template.bind({});
export const MultipleChildren = Template.bind({});
export const ZeroArgs = Template.bind({});

CustomLoader.args = {
  children: <ChildComponent />,
  isLoading: true,
  size: 100,
  thickness: 5,
};
FinishedLoading.args = {
  children: <ChildComponent />,
  isLoading: false,
};
IsLoading.args = {
  children: <ChildComponent />,
  isLoading: true,
};
MultipleChildren.args = {
  children: [<ChildComponent key={1} />, <SecondChildComponent key={2} />],
  isLoading: false,
};
ZeroArgs.args = {};
