import React from 'react'
import PropTypes from 'prop-types'
import './button.scss'
import classNames from 'classnames'

export const Button = ({ type, label, classList, onClick }) => {
  const buttonClassName = classNames(`btn-${type}`, classList)

  return (
    <button type="button" className={buttonClassName} onClick={onClick}>
      {label}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  classList: PropTypes.string
}

Button.defaultProps = {
  type: 'primary',
  label: 'Button',
  onClick: () => {},
  classList: ''
}
