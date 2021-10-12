import React from 'react'

import {
  ARTIFACTS_PAGE,
  DATASETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODELS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_TAB
} from '../constants'
import { parseKeyValues } from './object'
import { formatDatetime } from './datetime'
import { convertBytes } from './convertBytes'
import { copyToClipboard } from './copyToClipboard'
import { generateUri } from './resources'
import { generateLinkPath, parseUri, truncateUid } from '../utils'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { getArtifactIdentifier } from './getUniqueIdentifier'

import { ReactComponent as SeverityOk } from '../images/severity-ok.svg'
import { ReactComponent as SeverityWarning } from '../images/severity-warning.svg'
import { ReactComponent as SeverityError } from '../images/severity-error.svg'

export const createArtifactsContent = (
  artifacts,
  page,
  pageTab,
  project,
  isSelectedItem
) => {
  return (artifacts.filter(artifact => !artifact.link_iteration) ?? []).map(
    artifact => {
      if (page === ARTIFACTS_PAGE) {
        return createArtifactsRowData(artifact)
      } else if (page === MODELS_PAGE) {
        if (pageTab === MODELS_TAB) {
          return createModelsRowData(artifact, project, isSelectedItem)
        } else if (pageTab === MODEL_ENDPOINTS_TAB) {
          return createModelEndpointsRowData(artifact, project, isSelectedItem)
        }
      } else if (page === FILES_PAGE) {
        return createFilesRowData(artifact, project, isSelectedItem)
      }

      return createDatasetsRowData(artifact, project, isSelectedItem)
    }
  )
}

const createArtifactsRowData = artifact => {
  return {
    key: {
      value: artifact.db_key,
      class: 'artifacts_medium',
      link: 'overview'
    },
    kind: {
      value: artifact.kind,
      class: 'artifacts_extra-small'
    },
    labels: {
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels'
    },
    producer: {
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer'
    },
    owner: {
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner'
    },
    updated: {
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small'
    },
    buttonPopout: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout'
    },
    buttonDownload: {
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload'
    }
  }
}

const createModelsRowData = (artifact, project, isSelectedItem) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`
  const identifier = getArtifactIdentifier(artifact, true)

  return {
    key: {
      id: `key${identifier}`,
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: identifier,
      value: artifact.db_key,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          MODELS_TAB,
          MODELS_TAB,
          artifact.db_key,
          artifact.tag,
          tab,
          artifact.tree,
          artifact.iter
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${truncateUid(artifact.tree)}${iter}`,
        tooltip: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${artifact.tree}${iter}`
      },
      rowExpanded: {
        getLink: false
      }
    },
    labels: {
      id: `labels${identifier}`,
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_extra-small',
      type: 'labels',
      hidden: isSelectedItem
    },
    producer: {
      id: `producer${identifier}`,
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer',
      hidden: isSelectedItem
    },
    owner: {
      id: `owner${identifier}`,
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner',
      hidden: isSelectedItem
    },
    updated: {
      id: `updated${identifier}`,
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    metrics: {
      id: `metrics${identifier}`,
      value: parseKeyValues(artifact.metrics),
      class: 'artifacts_big',
      type: 'metrics',
      hidden: isSelectedItem
    },
    frameWorkAndAlgorithm: {
      id: `frameWorkAndAlgorithm${identifier}`,
      value:
        artifact.framework || artifact.algorithm ? (
          <span>
            <span>{artifact.framework}</span>
            <br />
            <span>{artifact.algorithm}</span>
          </span>
        ) : (
          ''
        ),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    version: {
      id: `version${identifier}`,
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    buttonPopout: {
      id: `buttonPopout${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout',
      hidden: isSelectedItem
    },
    buttonDownload: {
      id: `buttonDownload${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload',
      hidden: isSelectedItem
    },
    buttonCopy: {
      id: `buttonCopy${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
      hidden: isSelectedItem
    }
  }
}

const createFilesRowData = (artifact, project, isSelectedItem) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`
  const identifier = getArtifactIdentifier(artifact, true)

  return {
    key: {
      id: `key${identifier}`,
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: identifier,
      value: artifact.db_key,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          FILES_PAGE,
          null,
          artifact.db_key,
          artifact.tag,
          tab,
          artifact.tree,
          artifact.iter
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${truncateUid(artifact.tree)}${iter}`,
        tooltip: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${artifact.tree}${iter}`
      },
      rowExpanded: {
        getLink: false
      }
    },
    version: {
      id: `version${identifier}`,
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    kind: {
      id: `kind${identifier}`,
      value: artifact.kind,
      class: 'artifacts_extra-small',
      hidden: isSelectedItem
    },
    labels: {
      id: `labels${identifier}`,
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isSelectedItem
    },
    producer: {
      id: `producer${identifier}`,
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer',
      hidden: isSelectedItem
    },
    owner: {
      id: `owner${identifier}`,
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner',
      hidden: isSelectedItem
    },
    updated: {
      id: `updated${identifier}`,
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    size: {
      id: `size${identifier}`,
      value: convertBytes(artifact.size || 0),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    buttonPopout: {
      id: `buttonPopout${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout',
      hidden: isSelectedItem
    },
    buttonDownload: {
      id: `buttonDownload${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload',
      hidden: isSelectedItem
    },
    buttonCopy: {
      id: `buttonCopy${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) =>
        copyToClipboard(generateUri(item, tab ?? 'artifacts')),
      hidden: isSelectedItem
    }
  }
}

const driftStatusIcons = {
  NO_DRIFT: {
    value: <SeverityOk />,
    tooltip: 'No drift'
  },
  POSSIBLE_DRIFT: {
    value: <SeverityWarning />,
    tooltip: 'Possible drift'
  },
  DRIFT_DETECTED: {
    value: <SeverityError />,
    tooltip: 'Drift detected'
  }
}

const createModelEndpointsRowData = (artifact, project, isSelectedItem) => {
  const { name, tag = '-' } =
    (artifact.spec?.model ?? '').match(/^(?<name>.*?)(:(?<tag>.*))?$/)
      ?.groups ?? {}
  const { key: modelArtifact } = parseUri(artifact.spec?.model_uri)
  const functionUri = artifact.spec?.function_uri
    ? `store://functions/${artifact.spec.function_uri}`
    : ''
  const { key: functionName } = parseUri(functionUri)
  const averageLatency =
    artifact.status?.metrics?.latency_avg_1h?.values?.[0]?.[1]
  const identifier = getArtifactIdentifier(artifact, true)

  return {
    key: {
      id: `key${identifier}`,
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: identifier,
      value: functionName,
      class: 'artifacts_medium',
      getLink: () => `${generateLinkPath(functionUri)}/overview`,
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.spec?.model,
        tooltip: artifact.spec?.model,
        getLink: tab =>
          generateLinkToDetailsPanel(
            project,
            MODELS_TAB,
            MODEL_ENDPOINTS_TAB,
            name,
            artifact.metadata?.uid,
            tab
          )
      },
      rowExpanded: {
        getLink: () => `${generateLinkPath(functionUri)}/overview`
      }
    },
    modelArtifact: {
      id: `modelArtifact${identifier}`,
      value: '',
      class: 'artifacts_small',
      hidden: isSelectedItem,
      expandedCellContent: {
        class: 'artifacts_small',
        value: modelArtifact,
        tooltip: artifact.spec?.model_uri,
        getLink: () => `${generateLinkPath(artifact.spec?.model_uri)}/overview`
      }
    },
    state: {
      id: `state${identifier}`,
      value: '',
      class: 'artifacts_extra-small',
      type: 'hidden',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: artifact.status?.state,
        class: 'artifacts_extra-small'
      }
    },
    version: {
      id: `version${identifier}`,
      value: '',
      class: 'artifacts_extra-small',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: artifact?.status?.children ? 'Router' : tag,
        class: 'artifacts_extra-small'
      }
    },
    modelClass: {
      id: `modelClass${identifier}`,
      value: '',
      class: 'artifacts_small',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: artifact.spec?.model_class,
        class: 'artifacts_small'
      }
    },
    labels: {
      id: `labels${identifier}`,
      value: '',
      class: 'artifacts_big',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: parseKeyValues(artifact.metadata?.labels),
        class: 'artifacts_big',
        type: 'labels'
      }
    },
    firstRequest: {
      id: `firstRequest${identifier}`,
      value: '',
      class: 'artifacts_small',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: formatDatetime(new Date(artifact.status?.first_request), '-'),
        class: 'artifacts_small'
      }
    },
    lastRequest: {
      id: `lastRequest${identifier}`,
      value: '',
      class: 'artifacts_small',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: formatDatetime(new Date(artifact.status?.last_request), '-'),
        class: 'artifacts_small'
      }
    },
    averageLatency: {
      id: `averageLatency${identifier}`,
      value: '',
      class: 'artifacts_small',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: averageLatency ? `${(averageLatency / 1000).toFixed(2)}ms` : '-',
        class: 'artifacts_small'
      }
    },
    errorCount: {
      id: `errorCount${identifier}`,
      value: '',
      class: 'artifacts_small',
      hidden: isSelectedItem,
      expandedCellContent: {
        value: artifact.status?.error_count ?? '-',
        class: 'artifacts_small'
      }
    },
    driftStatus: {
      id: `driftStatus${identifier}`,
      value: '',
      class: 'artifacts_extra-small',
      hidden: isSelectedItem,
      expandedCellContent: {
        status: artifact.status?.drift_status,
        value: driftStatusIcons[artifact.status?.drift_status]?.value,
        class: 'artifacts_extra-small',
        tooltip: driftStatusIcons[artifact.status?.drift_status]?.tooltip
      }
    }
  }
}

const createDatasetsRowData = (artifact, project, isSelectedItem) => {
  const iter = isNaN(parseInt(artifact?.iter)) ? '' : ` #${artifact?.iter}`
  const identifier = getArtifactIdentifier(artifact, true)

  return {
    key: {
      id: `key${identifier}`,
      identifier: getArtifactIdentifier(artifact),
      identifierUnique: identifier,
      value: artifact.db_key,
      class: 'artifacts_medium',
      getLink: tab =>
        generateLinkToDetailsPanel(
          project,
          FEATURE_STORE_PAGE,
          DATASETS_TAB,
          artifact.db_key,
          artifact.tag,
          tab,
          artifact.tree,
          artifact.iter
        ),
      expandedCellContent: {
        class: 'artifacts_medium',
        value: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${truncateUid(artifact.tree)}${iter}`,
        tooltip: artifact.tag
          ? `${artifact.tag}${iter}`
          : `${artifact.tree}${iter}`
      },
      rowExpanded: {
        getLink: false
      }
    },
    labels: {
      id: `labels${identifier}`,
      value: parseKeyValues(artifact.labels),
      class: 'artifacts_big',
      type: 'labels',
      hidden: isSelectedItem
    },
    producer: {
      id: `producer${identifier}`,
      value: artifact.producer,
      class: 'artifacts_small',
      type: 'producer',
      hidden: isSelectedItem
    },
    owner: {
      id: `owner${identifier}`,
      value: artifact.producer?.owner,
      class: 'artifacts_small',
      type: 'owner',
      hidden: isSelectedItem
    },
    updated: {
      id: `updated${identifier}`,
      value: artifact.updated
        ? formatDatetime(new Date(artifact.updated), 'N/A')
        : 'N/A',
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    size: {
      id: `size${identifier}`,
      value: convertBytes(artifact.size || 0),
      class: 'artifacts_small',
      hidden: isSelectedItem
    },
    version: {
      id: `version${identifier}`,
      value: artifact.tag,
      class: 'artifacts_small',
      type: 'hidden',
      hidden: isSelectedItem
    },
    buttonPopout: {
      id: `buttonPopout${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonPopout',
      hidden: isSelectedItem
    },
    buttonDownload: {
      id: `buttonDownload${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonDownload',
      hidden: isSelectedItem
    },
    buttonCopy: {
      id: `buttonCopy${identifier}`,
      value: '',
      class: 'artifacts_extra-small artifacts__icon',
      type: 'buttonCopyURI',
      actionHandler: (item, tab) => copyToClipboard(generateUri(item, tab)),
      hidden: isSelectedItem
    }
  }
}

export default createArtifactsContent
