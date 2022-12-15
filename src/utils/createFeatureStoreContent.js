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
import React from 'react'

import AddFeatureButton from '../elements/AddFeatureButton/AddFeatureButton'
import FeatureValidator from '../elements/FeatureValidator/FeatureValidator'

import {
  FEATURE_STORE_PAGE,
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  BUTTON_COPY_URI_CELL_TYPE
} from '../constants'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import { copyToClipboard } from './copyToClipboard'
import { generateUri } from './resources'
import { truncateUid } from '../utils'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'

import { ReactComponent as Nosql } from 'igz-controls/images/nosql.svg'
import { ReactComponent as Stream } from 'igz-controls/images/stream.svg'
import { ReactComponent as TsdbIcon } from 'igz-controls/images/tsdb-icon.svg'
import { ReactComponent as DbIcon } from 'igz-controls/images/db-icon.svg'

export const createFeatureStoreContent = (content, pageTab, project, isTablePanelOpen) => {
  return content.map(contentItem => {
    if (pageTab === FEATURE_SETS_TAB) {
      return createFeatureSetsRowData(contentItem, pageTab, project)
    } else if (pageTab === FEATURE_VECTORS_TAB) {
      return createFeatureVectorsRowData(contentItem, pageTab, project)
    }

    return createFeaturesRowData(contentItem, isTablePanelOpen)
  })
}

export const createFeatureSetsRowData = (featureSet, pageTab, project, showExpandButton) => {
  return {
    data: {
      ...featureSet
    },
    content: [
      {
        id: `key.${featureSet.ui.identifierUnique}`,
        header: 'Name',
        value: featureSet.name,
        class: 'table-cell-2',
        getLink: tab =>
          generateLinkToDetailsPanel(
            project,
            FEATURE_STORE_PAGE,
            FEATURE_SETS_TAB,
            featureSet.name,
            featureSet.tag,
            tab,
            featureSet.uid
          ),
        showTag: true,
        showStatus: true,
        expandedCellContent: {
          class: 'table-cell-2',
          value: featureSet.tag || truncateUid(featureSet.uid),
          tooltip: featureSet.tag || featureSet.uid,
          showTag: true,
          showStatus: true
        },
        showExpandButton
      },
      {
        id: `description.${featureSet.ui.identifierUnique}`,
        header: 'Description',
        value: featureSet.description,
        class: 'table-cell-2'
      },
      {
        id: `labels.${featureSet.ui.identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(featureSet.labels),
        class: 'table-cell-4',
        type: 'labels'
      },
      {
        id: `version.${featureSet.ui.identifierUnique}`,
        value: featureSet.tag,
        class: 'table-cell-2',
        type: 'hidden'
      },
      {
        id: `entity.${featureSet.ui.identifierUnique}`,
        header: 'Entities',
        value: featureSet.entities?.slice(0, 2).map(entity => entity.name) || '',
        type: 'labels',
        class: 'table-cell-2'
      },
      { ...getFeatureSetTargetCellValue(featureSet.targets) },
      {
        id: `buttonCopy.${featureSet.ui.identifierUnique}`,
        value: '',
        class: 'table-cell-1 artifacts__icon',
        type: BUTTON_COPY_URI_CELL_TYPE,
        actionHandler: item => {
          copyToClipboard(generateUri(item, pageTab))
        }
      }
    ]
  }
}

export const createFeaturesRowData = (feature, isTablePanelOpen, showExpandButton) => {
  return {
    data: {
      ...feature
    },
    content: [
      {
        id: `key.${feature.ui.identifierUnique}`,
        header: 'Feature Name',
        type: feature.ui.type,
        value: feature.name,
        class: 'table-cell-2',
        expandedCellContent: {
          class: 'table-cell-2',
          value: feature.metadata?.tag
        },
        showExpandButton
      },
      {
        id: `feature_set.${feature.ui.identifierUnique}`,
        header: 'Feature set',
        value: feature.metadata?.name,
        class: 'table-cell-1',
        getLink: tab =>
          generateLinkToDetailsPanel(
            feature.metadata?.project,
            FEATURE_STORE_PAGE,
            FEATURE_SETS_TAB,
            feature.metadata?.name,
            feature.metadata?.tag,
            tab
          ),
        expandedCellContent: {
          class: 'table-cell-1',
          value: ''
        },
        rowExpanded: {
          getLink: tab =>
            generateLinkToDetailsPanel(
              feature.metadata?.project,
              FEATURE_STORE_PAGE,
              FEATURE_SETS_TAB,
              feature.metadata?.name,
              feature.metadata?.tag,
              tab
            )
        }
      },
      {
        id: `type.${feature.ui.identifierUnique}`,
        header: 'Type',
        value: feature.value_type,
        class: 'table-cell-1'
      },
      {
        id: `entity.${feature.ui.identifierUnique}`,
        header: 'Entities',
        type: 'labels',
        value: feature.spec?.entities.map(entity => entity.name) || '',
        class: 'table-cell-2'
      },
      {
        id: `description.${feature.ui.identifierUnique}`,
        header: 'Description',
        value: feature.description,
        class: 'table-cell-2',
        hidden: isTablePanelOpen
      },
      {
        id: `labels.${feature.ui.identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(feature.labels),
        class: 'table-cell-4',
        type: 'labels',
        hidden: isTablePanelOpen
      },
      {
        ...getFeatureSetTargetCellValue(feature.targets),
        hidden: isTablePanelOpen
      },
      {
        id: `validator.${feature.ui.identifierUnique}`,
        header: 'Validator',
        value: <FeatureValidator validator={feature.validator} />,
        class: 'table-cell-2',
        type: 'component',
        hidden: isTablePanelOpen
      },
      {
        id: `addFeature.${feature.ui.identifierUnique}`,
        value: feature.ui.type === 'feature' && <AddFeatureButton feature={feature} />,
        class: 'table-cell-2 align-right',
        type: 'component',
        hidden: !isTablePanelOpen
      }
    ]
  }
}

const kindToIcon = {
  nosql: {
    icon: <Nosql />,
    tooltip: 'NoSql'
  },
  stream: {
    icon: <Stream />,
    tooltip: 'Stream'
  },
  tsdb: {
    icon: <TsdbIcon />,
    tooltip: 'TSDB'
  }
}

const getFeatureSetTargetCellValue = (targets, identifierUnique) => ({
  header: 'Targets',
  value: (targets ?? [])
    .map(
      target =>
        kindToIcon[target.kind] ?? {
          icon: <DbIcon />,
          tooltip: target.kind
        }
    )
    .sort((icon, otherIcon) => (icon.tooltip < otherIcon.tooltip ? -1 : 1)),
  id: `targets.${identifierUnique}`,
  class: 'table-cell-2 artifacts__targets-icon',
  type: 'icons'
})

export const createFeatureVectorsRowData = (featureVector, pageTab, project, showExpandButton) => {
  return {
    data: {
      ...featureVector
    },
    content: [
      {
        id: `key.${featureVector.ui.identifierUnique}`,
        header: 'Name',
        value: featureVector.name,
        class: 'table-cell-3',
        getLink: tab =>
          generateLinkToDetailsPanel(
            project,
            FEATURE_STORE_PAGE,
            FEATURE_VECTORS_TAB,
            featureVector.name,
            featureVector.tag,
            tab,
            featureVector.uid
          ),
        showTag: true,
        showStatus: true,
        expandedCellContent: {
          class: 'table-cell-3',
          value: featureVector.tag || truncateUid(featureVector.uid),
          tooltip: featureVector.tag || featureVector.uid,
          showTag: true,
          showStatus: true
        },
        showExpandButton
      },
      {
        id: `description.${featureVector.ui.identifierUnique}`,
        header: 'Description',
        value: featureVector.description,
        class: 'table-cell-3'
      },
      {
        id: `labels.${featureVector.ui.identifierUnique}`,
        header: 'Labels',
        value: parseKeyValues(featureVector.labels),
        class: 'table-cell-4',
        type: 'labels'
      },
      {
        id: `version.${featureVector.ui.identifierUnique}`,
        value: featureVector.tag,
        class: 'table-cell-2',
        type: 'hidden'
      },
      {
        id: `entity.${featureVector.ui.identifierUnique}`,
        header: 'Entities',
        value: featureVector.index_keys?.join(', ') ?? '',
        class: 'table-cell-2'
      },
      {
        id: `updated.${featureVector.ui.identifierUnique}`,
        header: 'Updated',
        value: featureVector.updated
          ? formatDatetime(featureVector.updated, 'N/A')
          : 'N/A',
        class: 'table-cell-2',
        showTag: true,
        showStatus: true
      },
      {
        id: `buttonCopy.${featureVector.ui.identifierUnique}`,
        value: '',
        class: 'table-cell-1 artifacts__icon',
        type: BUTTON_COPY_URI_CELL_TYPE,
        actionHandler: item => copyToClipboard(generateUri(item, pageTab))
      },
      {
        id: `uid.${featureVector.ui.identifierUnique}`,
        value: featureVector.uid,
        class: 'table-cell-2',
        type: 'hidden'
      }
    ]
  }
}
