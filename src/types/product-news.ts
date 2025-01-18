export type VersionType = 'patch' | 'minor' | 'major'

export interface ProductNews {
  id: string
  version: string
  versionType: VersionType
  title: string
  description: string
  changes: string[]
  createdAt: string
  publishedAt: string
}

export interface NewsViewState {
  lastViewedVersion: string
  lastViewedAt: string
}
