import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { selectOptions } from '../../components/JobsPanelAdvanced/jobsPanelAdvanced.util'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableAdvancedRow = ({
  content,
  handleEdit,
  selectedItem,
  setSelectedItem,
  table
}) => {
  const dataValue = table === 'env' ? 'value' : 'source'

  return (
    <div className="table__row edit-row">
      <div className="table__cell table__cell_edit">
        {table === 'env' ? (
          <Input
            density="dense"
            onChange={name =>
              setSelectedItem({
                ...selectedItem,
                newName: name
              })
            }
            required={
              selectedItem.newName !== selectedItem.data.name &&
              isNameNotUnique(selectedItem.newName, content)
            }
            requiredText="Name already exists"
            type="text"
            value={selectedItem.newName ?? selectedItem.data.name}
          />
        ) : (
          <Select
            density="dense"
            label={
              selectedItem.newKind
                ? selectedItem.newKind
                : selectedItem.data.kind
            }
            onClick={kind =>
              setSelectedItem({
                ...selectedItem,
                newKind: kind
              })
            }
            options={selectOptions.secretKind}
          />
        )}
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          density="dense"
          onChange={value =>
            setSelectedItem({
              ...selectedItem,
              data: { ...selectedItem.data, [dataValue]: value }
            })
          }
          type="text"
          value={selectedItem.data[dataValue]}
        />
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={
            selectedItem.newName !== selectedItem.data.name &&
            isNameNotUnique(selectedItem.newName, content)
          }
          onClick={() => handleEdit(selectedItem.data, table === 'env')}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableAdvancedRow.propTypes = {
  content: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  table: PropTypes.string.isRequired
}

export default EditableAdvancedRow
