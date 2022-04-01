import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import auth from './../auth/auth-helper';
import { Link, withRouter } from 'react-router-dom';

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#bef67a'}
  else
    return {color: '#ffffff'}
}
const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return {color: '#bef67a'}
  else
    return {color: '#ffffff'}
}

function Menu (props) {
    return (
        <AppBar position="static">
            <ToolBar>
                <Typography variant="h6" color="inherit">
                   Themanoc
                </Typography>
                <div>
                <Link to="/">
                    <IconButton aria-label="Home" style={isActive(props.history, '/')}>
                    <HomeIcon/>
                    </IconButton>
                </Link>
                </div>
                <div style={{ position: 'absolute', right: '10px '}}><span style={{ float: 'right'}}>
                {/* {
                    !auth.isAuthenticated() && (<span>
                    <Link to="/signup">
                        <Button style={isActive(props.history, '/signup')}>Sign up</Button>
                    </Link>
                    <Link to="/signin">
                        <Button style={isActive(props.history, '/signin')}>Sign in</Button>
                    </Link>
                    </span>)
                } */}
                {
                    auth.isAuthenticated() && (<span>
                    <Link to={"/user/" + auth.isAuthenticated().user._id}>
                        <Button style={isActive(props.history, '/user/' + auth.isAuthenticated().user._id)}>My Profile</Button>
                    </Link>
                    <Button color="inherit" onClick={() => {
                        auth.clearJWT(() => props.history.push('/'));
                    }}>Sign out</Button>
                    </span>)
                }
                </span></div>
            </ToolBar>
        </AppBar>
    )
};

export default withRouter(Menu);