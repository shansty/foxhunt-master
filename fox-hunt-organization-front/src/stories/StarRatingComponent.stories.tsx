import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import StarRatingComponent, {
  StarRatingComponentProps,
} from '../component/StarRatingComponent';

export default {
  title: 'StarRatingComponent',
  component: StarRatingComponent,
} as ComponentMeta<typeof StarRatingComponent>;

const Template: ComponentStory<typeof StarRatingComponent> = (
  args: StarRatingComponentProps,
) => <StarRatingComponent {...args} />;

export const ZeroStars = Template.bind({});
export const ThreeStars = Template.bind({});
export const NegativeRating = Template.bind({});

ZeroStars.args = {
  rating: 0,
};

ThreeStars.args = {
  rating: 3,
};

NegativeRating.args = {
  rating: -2,
};
