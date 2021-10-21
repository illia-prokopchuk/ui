import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import ProjectSettingsSource from '../ProjectSettingsSource/ProjectSettingsSource'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import Loader from '../../common/Loader/Loader'

import { ARTIFACT_PATH } from '../../components/ProjectSettings/projectSettings.util'

const ProjectSettingsGeneralView = React.forwardRef(
  (
    {
      artifactPath,
      editProject,
      error,
      generalParams,
      handleAddNewParameter,
      handleDeleteParameter,
      handleEditParameter,
      handleEditSource,
      handleOnChangeSettings,
      handleOnKeyDown,
      loading,
      setValidation,
      source,
      validation
    },
    ref
  ) => {
    return (
      <div className="settings__card">
        {loading ? (
          <Loader />
        ) : error ? (
          <div>
            <h1>{error}</h1>
          </div>
        ) : (
          <>
            <div className="settings__card-header">General</div>
            <div className="settings__card-content">
              <ProjectSettingsSource
                editSourceData={editProject.source}
                handleEditSource={handleEditSource}
                handleOnChangeSettings={handleOnChangeSettings}
                handleOnKeyDown={handleOnKeyDown}
                ref={ref}
                setValidation={setValidation}
                settingsSource={source}
                validation={validation}
              />
              <div className="settings__card-divider" />
              <div className="settings__artifact-path">
                <Input
                  floatingLabel
                  invalid={!validation.isPathValid}
                  label="Artifact path"
                  onChange={event =>
                    handleOnChangeSettings(event, ARTIFACT_PATH)
                  }
                  onKeyDown={handleOnKeyDown}
                  ref={ref}
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isPathValid: value
                    }))
                  }
                  value={editProject.artifact_path.value ?? artifactPath}
                />
              </div>
              <p className="settings__card-subtitle">Parameters</p>
              <p>
                The parameters enable users to pass key/value to the project
                context that can later be used for running jobs & pipelines
              </p>
              <KeyValueTable
                addNewItem={handleAddNewParameter}
                addNewItemLabel="Add parameter"
                className="settings__params"
                content={generalParams}
                deleteItem={handleDeleteParameter}
                editItem={handleEditParameter}
                isKeyRequired={true}
                isValueRequired={true}
                keyHeader="Key"
                keyLabel="Key"
                valueHeader="Value"
                valueLabel="Value"
                withEditMode
              />
            </div>
          </>
        )}
      </div>
    )
  }
)

ProjectSettingsGeneralView.defaultProps = {
  error: null,
  loading: null
}

ProjectSettingsGeneralView.propTypes = {
  artifactPath: PropTypes.string.isRequired,
  editProject: PropTypes.object.isRequired,
  error: PropTypes.string,
  generalParams: PropTypes.array.isRequired,
  handleAddNewParameter: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  handleEditSource: PropTypes.func.isRequired,
  handleOnChangeSettings: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setValidation: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  validation: PropTypes.object.isRequired
}

export default ProjectSettingsGeneralView
