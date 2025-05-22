import React from 'react';
import CustomTableRow from './CustomTableRow';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const testFeature = {
  id: 1,
  name: 'Feature test name',
  description: 'Feature test description.',
};
const testUpdateFeatureFunction = () => Promise.resolve();
const updatedDescription = 'Updated description';

beforeEach(() =>
  render(
    <CustomTableRow
      feature={testFeature}
      updateFeature={testUpdateFeatureFunction}
    />,
  ),
);

test('Renders 2 TableCells with name and description', () => {
  expect(screen.getAllByText('Feature test name')).toHaveLength(1);
  expect(screen.getAllByText('Feature test description.')).toHaveLength(1);
});

test('Renders Edit Icon', () => {
  expect(screen.getAllByLabelText('edit')).toHaveLength(1);
});

test('Renders 2 Icons and textarea after a click edit', () => {
  userEvent.click(screen.getByLabelText('edit'));

  const textareas = document.querySelectorAll(`[id^="textarea-description"]`);

  expect(textareas).toHaveLength(1);
  expect(screen.getAllByLabelText('save')).toHaveLength(1);
  expect(screen.getAllByLabelText('revert')).toHaveLength(1);
});

test('Textarea dissappear after a click save', () => {
  userEvent.click(screen.getByLabelText('edit'));
  userEvent.click(screen.getByLabelText('save'));

  const textareas = document.querySelectorAll(`[id^="textarea-description"]`);
  expect(textareas).toHaveLength(0);
});

test('Textarea dissappear after a click cancel', () => {
  userEvent.click(screen.getByLabelText('edit'));
  userEvent.click(screen.getByLabelText('revert'));

  const textareas = document.querySelectorAll(`[id^="textarea-description"]`);
  expect(textareas).toHaveLength(0);
});
