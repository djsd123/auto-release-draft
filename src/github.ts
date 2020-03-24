import * as core from '@actions/core'
import * as github from '@actions/github'
import * as version from './version'
import * as markdown from './markdown'

export async function createReleaseDraft(
  versionTag: string,
  repoToken: string,
  changelog: string
): Promise<string> {
  const octokit = new github.GitHub(repoToken)

  const response = await octokit.repos.createRelease({
    body: markdown.toUnorderedList(changelog),
    draft: true,
    name: version.removePrefix(versionTag),
    prerelease: version.isPrerelease(versionTag),
    repo: github.context.repo.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    tag_name: versionTag,
    owner: github.context.repo.owner
  })

  if (response.status !== 201) {
    throw new Error(`Failed to create the release: ${response.status}`)
  }

  core.info(`Created release draft ${response.data.name}`)

  return response.data.html_url
}
