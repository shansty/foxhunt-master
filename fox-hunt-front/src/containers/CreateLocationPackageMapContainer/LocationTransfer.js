import React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { difference, intersection, union } from 'lodash';
import { styled } from '@mui/material';

const TransformLocationsGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    transform: 'rotate(90deg)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
}));

const StyledList = styled(List)(({ theme }) => ({
  height: 230,
  backgroundColor: theme.palette.background.paper,
  overflow: 'auto',
}));

export default function LocationTransfer(props) {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(props.left);
  const [right, setRight] = React.useState(props.right);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(difference(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    props.setLocations(right.concat(leftChecked));
    setLeft(difference(left, leftChecked));
    setChecked(difference(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(difference(right, rightChecked));
    props.setLocations(difference(right, rightChecked));
    setChecked(difference(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ p: (theme) => theme.spacing(1, 2) }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0 || props.isNotPrivate}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <StyledList dense component="div" role="list">
        {items.map((value) => (
          <ListItem
            key={value.id}
            role="listitem"
            button
            onClick={handleToggle(value)}
            disabled={props.isNotPrivate}
          >
            <ListItemIcon>
              <Checkbox
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                inputProps={{ 'aria-labelledby': value.id }}
              />
            </ListItemIcon>
            <ListItemText id={value.id} primary={value.name} />
          </ListItem>
        ))}
        <ListItem />
      </StyledList>
    </Card>
  );

  return (
    <Grid
      sx={{ width: '100%', m: 'auto' }}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid md={5} xs={12} item>
        {customList('Choices', left)}
      </Grid>
      <TransformLocationsGrid md={2} xs={12} item>
        <Grid container direction="column" alignItems="center">
          <StyledButton
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0 || props.isNotPrivate}
            aria-label="move selected right"
          >
            &gt;
          </StyledButton>
          <StyledButton
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0 || props.isNotPrivate}
            aria-label="move selected left"
          >
            &lt;
          </StyledButton>
        </Grid>
      </TransformLocationsGrid>
      <Grid md={5} xs={12} item>
        {customList('Chosen', right)}
      </Grid>
    </Grid>
  );
}
