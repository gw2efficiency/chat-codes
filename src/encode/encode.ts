import { CodeType, TYPE_HEADERS } from '../static'
import { encodeIdLink, IdLinkMeta } from './encodeIdLink'
import { encodeObjectiveLink, ObjectiveLinkMeta } from './encodeObjectiveLink'
import { encodeItemLink, ItemLinkMeta } from './encodeItemLink'
import { BuildLinkMeta, encodeBuildLink } from './encodeBuildLink'

type MetaOrId = string | number | IdLinkMeta | ItemLinkMeta | ObjectiveLinkMeta | BuildLinkMeta

export function encode(type: CodeType, metaOrId: MetaOrId): string | false {
  const codeType = type.trim().toLowerCase() as CodeType

  // Normalize into a meta object if only the ID was passed
  const meta = typeof metaOrId !== 'object' ? { id: metaOrId } : metaOrId

  switch (codeType) {
    case 'map':
    case 'skill':
    case 'trait':
    case 'recipe':
    case 'skin':
    case 'outfit':
      return encodeIdLink(TYPE_HEADERS[codeType], meta as IdLinkMeta)
    case 'item':
      return encodeItemLink(meta as ItemLinkMeta)
    case 'objective':
      return encodeObjectiveLink(meta as ObjectiveLinkMeta)
    case 'build':
      return encodeBuildLink(meta as BuildLinkMeta)
    default:
      return false
  }
}
