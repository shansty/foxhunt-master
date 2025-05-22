import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { blue } from '@mui/material/colors';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  arrow: {
    margin: 'auto',
    width: '100%',
    color: blue[600],
    height: '2rem',
  },
});

export interface PageState {
  page: number;
  rowsPerPage: number;
}

export interface IListItem {
  id: number;
  text: string;
}

export interface ListProps {
  title: string;
  defaultSelectedItem: IListItem | undefined;
  withAvatar: boolean;
  onSubmit: (selectedId: number | undefined) => any;
  onClose: (args: any) => any;
  onLoadMore: (params: PageState) => Promise<IListItem[]>;
}

export function ItemsList(props: ListProps) {
  const classes = useStyles();
  const {
    title,
    defaultSelectedItem,
    withAvatar,
    onSubmit,
    onClose,
    onLoadMore,
  } = props;

  const initialPageState: PageState = {
    page: 0,
    rowsPerPage: 10,
  };
  const [page, setPage] = useState<PageState>(initialPageState);
  const [items, setItems] = useState<IListItem[]>(
    defaultSelectedItem ? [defaultSelectedItem] : [],
  );
  const [isArrowShow, setArrowShow] = useState<boolean>(true);
  const [selected, setSelected] = useState<IListItem | undefined>();

  useEffect(() => {
    onLoadMore(page).then((listItems: IListItem[]) => {
      setItems((items) => items.concat(listItems));
      if (listItems.length === 0 || listItems.length < page.rowsPerPage) {
        setArrowShow(false);
      }
    });
  }, [page]);

  useEffect(() => {
    if (defaultSelectedItem) {
      setSelected(defaultSelectedItem);
      setItems((items) => {
        items.unshift(defaultSelectedItem);
        return items;
      });
    }
  }, [defaultSelectedItem]);

  const handleListItemClick = (item: IListItem) => {
    setSelected(item);
  };

  const onSave = () => {
    onSubmit(selected?.id);
  };
  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <List>
        {items.map((item: IListItem, index: number) => {
          const isItemTheSameAsDefault =
            index !== 0 && item.id === defaultSelectedItem?.id;
          return (
            !isItemTheSameAsDefault && (
              <ListItem
                button
                selected={selected && selected.id === item.id}
                onClick={() => handleListItemClick(item)}
                key={item.id}
              >
                {withAvatar && (
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                )}
                <ListItemText primary={item.text} />
              </ListItem>
            )
          );
        })}
        {isArrowShow && (
          <ArrowDropDownCircleOutlinedIcon
            onClick={() =>
              setPage((oldPage) => ({ ...oldPage, page: oldPage.page + 1 }))
            }
            className={classes.arrow}
          ></ArrowDropDownCircleOutlinedIcon>
        )}
        <Grid
          item
          container
          direction={'row'}
          style={{ marginTop: '20px' }}
          justifyContent={'center'}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size={'medium'}
              onClick={onSave}
              style={{ marginRight: '10%' }}
            >
              Ok
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              size={'medium'}
              onClick={onClose}
              style={{ marginLeft: '10%' }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </List>
    </Dialog>
  );
}
