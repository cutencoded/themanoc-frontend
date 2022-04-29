import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";
import HomeIcon from '@material-ui/icons/Home';
import auth from './../auth/auth-helper';
import Header from './Header';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";


const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return classes.navLink + " " + classes.navLinkActive
  else
    return classes.navLink
}

import styles from "./navbarsStyle.js";

const useStyles = makeStyles(styles);

function Menu (props) {
    const classes = useStyles();

    const isActive = (history, path) => {
        if (history.location.pathname.endsWith(path))
            return classes.navLink + " " + classes.navLinkActive
        else
            return classes.navLink
    };

    return (
        <Header
            brand="Themanoc"
            color="dark"
            rightLinks={
              <List className={classes.list}>
                <ListItem className={classes.listItem}>
                  <Button
                    href="/"
                    className={isActive(props.history, '/')}
                    // onClick={e => e.preventDefault()}
                    color="transparent"
                  >
                    Home
                  </Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <Button
                    href="/users"
                    className={isActive(props.history, '/users')}
                    // onClick={e => e.preventDefault()}
                    color="transparent"
                  >
                    Students
                  </Button>
                </ListItem>
                {
                    !auth.isAuthenticated() && (<span>
                        <ListItem className={classes.listItem}>
                        <Button
                            href="/signin"
                            className={isActive(props.history, '/signin')}
                            // onClick={e => e.preventDefault()}
                            color="transparent"
                        >
                            Sign in
                        </Button>
                        </ListItem>
                        <ListItem className={classes.listItem}>
                        <Button
                            href="/signup"
                            className={isActive(props.history, '/signup')}
                            // onClick={e => e.preventDefault()}
                            color="transparent"
                        >
                            Sign up
                        </Button>
                        </ListItem>
                    </span>)
                }
                {
                    auth.isAuthenticated() && (<span>
                        <ListItem className={classes.listItem}>
                        <Button
                            href={'/user/' + auth.isAuthenticated().user._id}
                            className={isActive(props.history, '/user/' + auth.isAuthenticated().user._id)}
                            // onClick={e => e.preventDefault()}
                            color="transparent"
                        > 
                        My Profile
                        </Button>
                        </ListItem>
                    </span>)
                }                
              </List>
            }
          />
    )
};

export default withRouter(Menu);