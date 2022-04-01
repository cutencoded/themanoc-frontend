import config from './../config/config';
import React, { useState, useEffect } from 'react'
import auth from './../auth/auth-helper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import UpvoteIcon from '@material-ui/icons/KeyboardArrowUp';
import DownvoteIcon from '@material-ui/icons/KeyboardArrowDown';
import VerifiedIcon from '@material-ui/icons/VerifiedUser';
import Divider from '@material-ui/core/Divider'
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { remove, upvote, removeUpvote, downvote, removeDownvote } from './translation-api';
import includes from 'lodash.includes'
// import Comments from './Comments';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        // minWidth: 365,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
        backgroundColor: 'white',
        padding: `${theme.spacing(2)}px 0px`
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    text: {
        margin: theme.spacing(2)
    },
    photo: {
        textAlign: 'center',
        backgroundColor: '#f2f5f4',
        padding: theme.spacing(1)
    },
    media: {
        height: 200
    },
    snack: {
        color: theme.palette.protectedTitle
    },
    button: {
        margin: theme.spacing(1),
    }
}))

export default function Translation(props) {
    const classes = useStyles()

    const jwt = auth.isAuthenticated();

    if (!props.translation.upvotes) {
        props.translation.upvotes = [];
        props.translation.downvotes = [];
    }

    // console.log('Got props: ', props.translation)

    const [upvotes, setUpvotes] = useState([...props.translation.upvotes]);
    const [downvotes, setDownvotes] = useState([...props.translation.downvotes]);

    const [values, setValues] = useState({
        verified: props.translation.verified
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const camelizeFirstChar = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

    const callApi = (params, operation) => {
        operation(...params).then((data) => {
            if (data.error) console.log(data.error);
            else {
                if (!data.upvotes) {
                    data.upvotes = [];
                    data.downvotes = [];
                }
                setUpvotes(data.upvotes);
                setDownvotes(data.downvotes);
            }
        })
    };
    
    const clickUpvote = () => {
        const userId = jwt.user._id;
        const params = [{ userId }, { t: jwt.token }, props.translation._id];

        if (!values.verified) {
            if (!upvotes.includes(userId) && !downvotes.includes(userId)) {
                return callApi(params, upvote);
            }

            if (!upvotes.includes(userId) && downvotes.includes(userId)) {
                callApi(params, removeDownvote);
                return callApi(params, upvote);
            }

            if (upvotes.includes(userId) && !downvotes.includes(userId)) {
                return callApi(params, removeUpvote);
            }
        }

        else {
            setSnackbar({
                ...snackbar,
                open: true,
                message: 'Translation verified. Upvoting is locked.'
            });
        }
    }

    const clickDownvote = () => {
        const userId = jwt.user._id;
        const params = [{ userId }, { t: jwt.token }, props.translation._id];

        if (!values.verified) {
            if (!downvotes.includes(userId) && !upvotes.includes(userId)) {
                return callApi(params, downvote);
            }

            if (!downvotes.includes(userId) && upvotes.includes(userId)) {
                callApi(params, removeUpvote);
                return callApi(params, downvote);
            }

            if (downvotes.includes(userId) && !upvotes.includes(userId)) {
                return callApi(params, removeDownvote);
            }
        }

        else {
            setSnackbar({
                ...snackbar,
                open: true,
                message: 'Translation verified. Downvoting is locked.'
            });
        }
    }

    const deleteTranslation = () => {
        remove({ translationId: props.translation._id }, { t: jwt.token }).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                props.onRemove(props.translation)
            }
        })
    }

    const handleRequestClose = (event, reason) => {
        setSnackbar({...snackbar, open: false })
    }

    return (<div>
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar src={`${config.serverUrl}/api/users/photo/` + props.translation.translatedBy._id} />
                }
                action={props.translation.translatedBy._id === auth.isAuthenticated().user._id &&
                    <IconButton onClick={deleteTranslation}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={<Link to={"/user/" + props.translation.translatedBy._id}>{props.translation.translatedBy.name}</Link>}
                subheader={(new Date(props.translation.created)).toDateString()}
                className={classes.cardHeader}
            />
            <CardContent className={classes.cardContent}>
                <List>
                    <ListItem>
                        <ListItemText
                            primary={`isiNdebele: ${camelizeFirstChar(props.translation.ndebele)}`}
                            secondary={`English: ${camelizeFirstChar(props.translation.english)}`}
                        />
                        <ListItemSecondaryAction>
                            {
                                values.verified && (
                                    <IconButton style={{ color: '#fffde7', backgroundColor: '#f57c00', marginRight: 5 }}><VerifiedIcon /></IconButton>
                                )
                            }
                            
                            <IconButton aria-label="Upvote" color={upvotes.includes(auth.isAuthenticated().user._id) ? 'secondary' : 'primary'} onClick={clickUpvote}>
                                <UpvoteIcon />
                            </IconButton>
                            {upvotes.length}
                            <IconButton aria-label="Downvote" color={downvotes.includes(auth.isAuthenticated().user._id) ? 'secondary' : 'primary'} onClick={clickDownvote}>
                                <DownvoteIcon />
                            </IconButton>
                            {downvotes.length}
                        </ListItemSecondaryAction>
                    </ListItem>    
                </List>
            </CardContent>
            <Divider />
            {/* <Comments translationId={props.translation._id} comments={values.comments} updateComments={updateComments}/> */}
        </Card>
         <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={snackbar.open}
            onClose={handleRequestClose}
            autoHideDuration={2000}
            message={<span className={classes.snack}>{snackbar.message}</span>}
        />
     </div>
    )
}

Translation.propTypes = {
    translation: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}
