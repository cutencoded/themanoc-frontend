import React from 'react'
import PropTypes from 'prop-types'
import Translation from './Translation'

export default function TranslationList (props) {
    return (
      <div style={{marginTop: '24px'}}>
        {props.translations.map((item, i) => {
            return <Translation translation={item} key={i} onRemove={props.removeUpdate}/>
          })
        }
      </div>
    )
}
TranslationList.propTypes = {
  translations: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired
}
