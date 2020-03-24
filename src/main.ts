import * as core from '@actions/core'
import * as event from './event'
import * as version from './version'
import {getChangesIntroducedByTag} from './git'
import * as github from './github'

export async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token')

    const tag = event.getCreatedTag()
    let releaseUrl = ''

    if (tag && version.isSemver(tag)) {
      const changelog = await getChangesIntroducedByTag(tag)

      releaseUrl = await github.createReleaseDraft(tag, token, changelog)
    }
    core.setOutput('release-url', releaseUrl)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
