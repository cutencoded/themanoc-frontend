import config from './../config/config';
import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ArrowForward from '@material-ui/icons/ArrowForward'
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid'
import {Link} from 'react-router-dom';
import Search from './Search';
import {list} from './api-user.js'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: 'auto',
        maxWidth: 350,
        marginTop: theme.spacing(5)
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        textAlign: 'center'
    },
    avatar: {
        width: 60,
        height: 60,
        margin: 10
    },
    searchField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 300,
      marginBottom: '20px'
    },
    searchButton: {
      minWidth: '20px',
      height: '30px',
      padding: '0 8px',
      marginBottom: '20px'
    },
    search: {
      flexGrow: 1,
      margin: 30,
    }
}));

export default function Users() { 
    const classes = useStyles();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        list({}, signal).then((data) => {
            // data = []
            if (data && data.error) {
                console.log(data.error);
            } else {
                setUsers(data);
            }
        })

        return function cleanup(){
            abortController.abort();
        }
    }, []);

    return (
      <Paper className={classes.root} elevation={4}>
        {/* <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={8} sm={8}>
              <Search/>
            </Grid>
          </Grid>
        </div> */}
        <Typography variant="h6" className={classes.title}>
            {"Abahumushi"}   
        </Typography>
        <List dense>
        {  
        users.map((item, i) => {
            const photoUrl = item._id
                ? `${config.serverUrl}/api/users/photo/${item._id}?${new Date().getTime()}`
                : `${config.serverUrl}/api/users/defaultphoto`
            return <Link to={"/user/" + item._id} key={i}>
                    <ListItem button>
                      <ListItemAvatar>
                        <Avatar src={photoUrl}/>
                      </ListItemAvatar>
                      <ListItemText primary={item.name}/>
                      <ListItemSecondaryAction>
                      <IconButton>
                          <ArrowForward/>
                      </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                 </Link>
               })
             }
        </List>
      </Paper>
    );
};
