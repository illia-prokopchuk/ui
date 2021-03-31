export const generateLinkToDetailsPanel = (
  project,
  screen,
  tab,
  key,
  version,
  detailsTab
) =>
  `/projects/${project}/${screen}${tab ? `/${tab}` : ''}/${key}${
    version ? `/${version}` : ''
  }/${detailsTab}`
