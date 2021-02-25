import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './loadButton.scss'

export const LoadButton = ({ type, label, classList, onClick }) => {
  const buttonClassName = classNames(`btn-${type}`, classList)

  return (
    <button type="button" className={buttonClassName} onClick={onClick}>
      {label}
    </button>
  )
}

LoadButton.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  classList: PropTypes.string
}

LoadButton.defaultProps = {
  type: 'primary',
  label: 'Button',
  onClick: () => {},
  classList: ''
}
