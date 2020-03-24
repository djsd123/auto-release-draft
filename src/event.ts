import * as core from '@actions/core'
import * as github from '@actions/github'

export function getCreatedTag(): string | null {
  if (github.context.eventName !== 'created') {
    core.info(`The event name was ${github.context.eventName}`)
    return null
  }

  // looking for key=ref_type in payload JSON object
  if (github.context.payload.ref_type !== 'tag') {
    core.info('The created reference was a branch, not a tag')
    return null
  }

  return github.context.payload.ref
}
