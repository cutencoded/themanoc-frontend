import React, {useState} from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FollowGrid from './../user/FollowGrid'
import TranslationList from './../translation/TranslationList';

export default function ProfileTabs ( props ){
  const [tab, setTab] = useState(0)

  const handleTabChange = (event, value) => {
    setTab(value)
  }

    return (
    <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Translations" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </AppBar>
       {tab === 0 && <TabContainer><TranslationList removeUpdate={props.removeTranslationUpdate} translations={props.translations}/></TabContainer>}
       {tab === 1 && <TabContainer><FollowGrid people={props.user.following}/></TabContainer>}
       {tab === 2 && <TabContainer><FollowGrid people={props.user.followers}/></TabContainer>}
    </div>)
  
}

ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
  removeTranslationUpdate: PropTypes.func.isRequired,
  translations: PropTypes.array.isRequired
}

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}
