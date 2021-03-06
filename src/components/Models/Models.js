import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import Content from '../../layout/Content/Content'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import DeployModelPopUp from '../../elements/DeployModelPopUp/DeployModelPopUp'

import artifactsAction from '../../actions/artifacts'
import detailsActions from '../../actions/details'
import filtersActions from '../../actions/filters'
import {
  handleFetchData,
  generatePageData,
  getFeatureVectorData,
  checkForSelectedModel,
  checkForSelectedModelEndpoint
} from './models.util'
import {
  INIT_GROUP_FILTER,
  INIT_TAG_FILTER,
  MODELS_TAB,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE
} from '../../constants'
import { generateArtifacts } from '../../utils/generateArtifacts'
import { filterArtifacts } from '../../utils/filterArtifacts'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'

const Models = ({
  artifactsStore,
  detailsStore,
  fetchModel,
  fetchModelEndpointWithAnalysis,
  fetchModelEndpoints,
  fetchModelFeatureVector,
  fetchModels,
  filtersStore,
  history,
  match,
  removeModel,
  removeModels,
  setFilters
}) => {
  const [content, setContent] = useState([])
  const [selectedModel, setSelectedModel] = useState({})
  const [deployModel, setDeployModel] = useState({})
  const [
    isRegisterArtifactPopupOpen,
    setIsRegisterArtifactPopupOpen
  ] = useState(false)
  const [isDeployPopupOpen, setIsDeployPopupOpen] = useState(false)
  const [yamlContent, setYamlContent] = useState({
    allData: [],
    selectedRowData: []
  })
  const [pageData, setPageData] = useState({
    detailsMenu: [],
    filters: [],
    infoHeaders: [],
    page: '',
    registerArtifactDialogTitle: '',
    tabs: []
  })

  const fetchData = useCallback(
    async filters => {
      const data = await handleFetchData(
        fetchModelEndpoints,
        fetchModels,
        filters,
        match.params.projectName,
        match.params.pageTab
      )

      if (data.content) {
        setContent(data.content)
        setYamlContent(state => ({
          ...state,
          allData: data.yamlContent
        }))
      }

      return data.yamlContent
    },
    [
      fetchModelEndpoints,
      fetchModels,
      match.params.pageTab,
      match.params.projectName
    ]
  )

  const closeDeployModelPopUp = () => {
    setDeployModel({})
    setIsDeployPopupOpen(false)
  }

  const handleDeployModel = useCallback(model => {
    setDeployModel(model)
    setIsDeployPopupOpen(true)
  }, [])

  const handleRemoveModel = useCallback(
    model => {
      const newSelectedRowData = {
        ...artifactsStore.models.selectedRowData
      }

      delete newSelectedRowData[model.db_key]

      removeModel(newSelectedRowData)
    },
    [artifactsStore.models.selectedRowData, removeModel]
  )

  const handleRequestOnExpand = useCallback(
    async item => {
      let result = []

      setPageData(state => ({
        ...state,
        selectedRowData: {
          ...state.selectedRowData,
          [item.db_key]: {
            loading: true
          }
        }
      }))

      try {
        result = await fetchModel(item.project, item.db_key, !filtersStore.iter)
      } catch (error) {
        setPageData(state => ({
          ...state,
          selectedRowData: {
            ...state.selectedRowData,
            [item.db_key]: {
              ...state.selectedRowData[item.db_key],
              error,
              loading: false
            }
          }
        }))
      }

      if (result?.length > 0) {
        setYamlContent(state => ({
          ...state,
          selectedRowData: result
        }))
        setPageData(state => {
          return {
            ...state,
            selectedRowData: {
              ...state.selectedRowData,
              [item.db_key]: {
                content: [
                  ...generateArtifacts(
                    filterArtifacts(result),
                    !filtersStore.iter
                  )
                ],
                error: null,
                loading: false
              }
            }
          }
        })
      }
    },
    [fetchModel, filtersStore.iter]
  )

  const handleExpandRow = useCallback((item, isCollapse) => {
    if (isCollapse) {
      setYamlContent(state => ({
        ...state,
        selectedRowData: []
      }))
    }
  }, [])

  useEffect(() => {
    fetchData({
      tag: INIT_TAG_FILTER,
      iter: match.params.pageTab === MODELS_TAB ? 'iter' : ''
    })

    return () => {
      setContent([])
      removeModels()
      setSelectedModel({})
      setYamlContent({
        allData: [],
        selectedRowData: []
      })
    }
  }, [fetchData, match.params.pageTab, removeModels])

  useEffect(() => {
    setPageData(state => ({
      ...state,
      ...generatePageData(
        selectedModel,
        match.params.pageTab,
        handleDeployModel,
        handleRequestOnExpand,
        handleRemoveModel
      )
    }))
  }, [
    handleDeployModel,
    handleRemoveModel,
    handleRequestOnExpand,
    match.params.pageTab,
    selectedModel
  ])

  useEffect(() => {
    if (match.params.pageTab === MODEL_ENDPOINTS_TAB) {
      setFilters({ groupBy: 'none' })
    } else if (filtersStore.tag === INIT_TAG_FILTER) {
      setFilters({ groupBy: INIT_GROUP_FILTER })
    } else {
      setFilters({ groupBy: 'none' })
    }
  }, [match.params.pageTab, filtersStore.tag, setFilters])

  useEffect(() => {
    if (
      match.params.name &&
      ((match.params.pageTab === MODELS_TAB &&
        artifactsStore.models.allData.length > 0) ||
        (match.params.pageTab === MODEL_ENDPOINTS_TAB &&
          artifactsStore.modelEndpoints.length > 0))
    ) {
      const { name, tag, iter } = match.params

      if (match.params.pageTab === MODELS_TAB) {
        checkForSelectedModel(
          history,
          match,
          artifactsStore.models,
          name,
          setSelectedModel,
          tag,
          iter
        )
      } else if (match.params.pageTab === MODEL_ENDPOINTS_TAB) {
        checkForSelectedModelEndpoint(
          fetchModelEndpointWithAnalysis,
          history,
          match,
          artifactsStore.modelEndpoints,
          tag,
          setSelectedModel
        )
      }
    } else {
      setSelectedModel({})
    }
  }, [
    artifactsStore.modelEndpoints,
    artifactsStore.models,
    fetchModelEndpointWithAnalysis,
    history,
    match
  ])

  useEffect(() => setContent([]), [filtersStore.tag])

  useEffect(() => {
    if (
      match.params.name &&
      match.params.tag &&
      pageData.detailsMenu.length > 0
    ) {
      isDetailsTabExists(
        MODELS_PAGE,
        match.params,
        pageData.detailsMenu,
        history
      )
    }
  }, [history, match.params, pageData.detailsMenu])

  useEffect(() => {
    if (
      match.params.pageTab === MODELS_TAB &&
      selectedModel.item?.feature_vector &&
      !detailsStore.modelFeatureVectorData.error &&
      isEmpty(detailsStore.modelFeatureVectorData)
    ) {
      const { name, tag } = getFeatureVectorData(
        selectedModel.item.feature_vector
      )
      fetchModelFeatureVector(match.params.projectName, name, tag)
    }
  }, [
    detailsStore.modelFeatureVectorData,
    detailsStore.modelFeatureVectorData.error,
    fetchModelFeatureVector,
    match.params.pageTab,
    match.params.projectName,
    selectedModel.item
  ])

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={content}
        expandRow={handleExpandRow}
        handleCancel={() => setSelectedModel({})}
        loading={artifactsStore.loading}
        match={match}
        openPopupDialog={() => setIsRegisterArtifactPopupOpen(true)}
        pageData={pageData}
        refresh={fetchData}
        selectedItem={selectedModel.item}
        yamlContent={yamlContent}
      />
      {isRegisterArtifactPopupOpen && (
        <RegisterArtifactPopup
          artifactKind={pageData.page.slice(0, -1)}
          match={match}
          refresh={fetchData}
          setIsPopupOpen={setIsRegisterArtifactPopupOpen}
          title={pageData.registerArtifactDialogTitle}
        />
      )}
      {isDeployPopupOpen && (
        <DeployModelPopUp
          closePopUp={closeDeployModelPopUp}
          model={deployModel}
        />
      )}
    </>
  )
}

Models.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ artifactsStore, filtersStore, detailsStore }) => ({
    artifactsStore,
    filtersStore,
    detailsStore
  }),
  {
    ...artifactsAction,
    ...detailsActions,
    ...filtersActions
  }
)(Models)
