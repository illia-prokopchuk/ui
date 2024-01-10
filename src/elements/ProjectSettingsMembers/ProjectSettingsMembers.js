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
import PropTypes from 'prop-types'

import MembersPopUp from '../MembersPopUp/MembersPopUp'
import Loader from '../../common/Loader/Loader'

import { ReactComponent as Users } from 'igz-controls/images/users.svg'

import './ProjectSettingsMembers.scss'

const ProjectSettingsMembers = ({
  changeMembersCallback,
  loading,
  membersDispatch,
  membersState,
  projectMembersIsShown,
  setNotification
}) => {
  const totalMembersInProject = membersState.users.length + membersState.userGroups.length

  const generateMembersTitle = () => {
    const ownerId = membersState.projectInfo?.owner?.id

    if (totalMembersInProject === 0) {
      if (!ownerId) {
        return <span>One owner has access to this project</span>
      } else {
        return <span>This project does not have a valid owner</span>
      }
    }

    const membersText = totalMembersInProject !== 1 ? 'members have' : 'member has'

    return (
      <span>
        {ownerId && 'One owner and '}
        <span className="settings__members-summary_amount">
          {totalMembersInProject !== 1 ? totalMembersInProject : ownerId ? 'one' : 'One'}
        </span>
        {`${membersText} access to this project`}
      </span>
    )
  }

  return (
    <div className="settings__card">
      {loading ? (
        <Loader />
      ) : (
        <div className="settings__card-content">
          <div className="settings__card-content-col">
            <div className="settings__members-summary">
              <span className="settings__members-summary_icon">
                <Users />
              </span>
              {generateMembersTitle()}
            </div>
            {projectMembersIsShown && (
              <MembersPopUp
                changeMembersCallback={changeMembersCallback}
                membersState={membersState}
                membersDispatch={membersDispatch}
                setNotification={setNotification}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

ProjectSettingsMembers.propTypes = {
  changeMembersCallback: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  membersDispatch: PropTypes.func.isRequired,
  membersState: PropTypes.shape({}).isRequired,
  projectMembersIsShown: PropTypes.bool.isRequired
}

export default ProjectSettingsMembers
