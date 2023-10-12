/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useContext, useCallback, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { fetchModels } from '../../reducers/artifactsReducer'
import { setArtifactTags } from '../../utils/artifacts.util'
import { cancelRequest } from '../../utils/cancelRequest'
import { showLargeResponsePopUp } from '../../utils/showLargeResponsePopUp'
import { useYaml } from '../../hooks/yaml.hook'

import { MODELS_TAB, REQUEST_CANCELED } from '../../constants'

export const ModelsPageContext = React.createContext({})

export const ModelsPageProvider = ({ children }) => {
  const [models, setModels] = useState([])
  const [allModels, setAllModels] = useState([])
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const dispatch = useDispatch()
  const params = useParams()
  const modelsRef = useRef({ current: null })

  const fetchData = useCallback(
    async filters => {
      const cancelRequestTimeout = setTimeout(() => {
        cancelRequest(modelsRef, REQUEST_CANCELED)
      }, 30000)
      const config = {
        cancelToken: new axios.CancelToken(cancel => {
          modelsRef.current.cancel = cancel
        })
      }

      return dispatch(fetchModels({ project: params.projectName, filters: filters, config }))
        .unwrap()
        .then(modelsResponse => {
          if (modelsResponse.length > 1500) {
            setArtifactTags([], setModels, setAllModels, filters, dispatch, MODELS_TAB)
            showLargeResponsePopUp(setLargeRequestErrorMessage)
          } else {
            setArtifactTags(modelsResponse, setModels, setAllModels, filters, dispatch, MODELS_TAB)
            setLargeRequestErrorMessage('')

            return modelsResponse
          }
        })
        .catch(error => {
          if (error.message === REQUEST_CANCELED) {
            setArtifactTags([], setModels, setAllModels, filters, dispatch, MODELS_TAB)
            showLargeResponsePopUp(setLargeRequestErrorMessage)
          }
        })
        .finally(() => clearTimeout(cancelRequestTimeout))
    },
    [dispatch, setModels, params.projectName]
  )

  return (
    <ModelsPageContext.Provider
      value={{
        fetchData,
        convertedYaml,
        models,
        allModels,
        setModels,
        setAllModels,
        toggleConvertedYaml,
        largeRequestErrorMessage
      }}
    >
      {children}
    </ModelsPageContext.Provider>
  )
}

export const useModelsPage = () => useContext(ModelsPageContext)
