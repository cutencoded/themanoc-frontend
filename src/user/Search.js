import React, {useState} from 'react'
// import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowForward from '@material-ui/icons/ArrowForward'
import {Link} from 'react-router-dom';

import {list} from './api-user'
// import Products from './Products'

const useStyles = makeStyles(theme => ({
    card: {
        margin: 'auto',
        textAlign: 'center',
        paddingTop: 10,
        backgroundColor: '#80808024'
    },
    menu: {
        width: 200,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 130,
        verticalAlign: 'bottom',
        marginBottom: '20px'
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
        // marginBottom: '20px'
        marginTop: '30px'
    }
}))

export default function Search() {
  const classes = useStyles()
  const [values, setValues] = useState({
      username: '',
      results: [],
      searched: false
  });

  const handleChange = name => event => setValues({ ...values, [name]: event.target.value });

  const searchUsers = () => {
    if (values.username) {
      list({ username: values.username }).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setValues({ ...values, results: data, searched: true })
        }
      })
    }
  }
  const enterKey = (event) => {
    if(event.keyCode == 13){
      event.preventDefault()
      searchUsers()
    }
  }
    return (
      <div>
        <Card className={classes.card}>
          <TextField
            id="search"
            label="Search users"
            type="search"
            onKeyDown={enterKey}
            onChange={handleChange('username')}
            className={classes.searchField}
            margin="normal"
          />
          <Button variant="contained" color={'primary'} className={classes.searchButton} onClick={searchUsers}>
            <SearchIcon/>
          </Button>
          <Divider/>
          {/* <Products products={values.results} searched={values.searched}/> */}
          <List dense>
        {values.results.map((item, i) => {
            const photoUrl = item._id
                ? `/api/users/photo/${item._id}?${new Date().getTime()}`
                : '/api/users/defaultphoto'
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
        </Card>
      </div>
    );
};
