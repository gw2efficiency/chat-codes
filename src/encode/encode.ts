import { CodeType, TYPE_HEADERS } from '../static'
import { encodeIdLink, IdLinkMeta } from './encodeIdLink'
import { encodeObjectiveLink, ObjectiveLinkMeta } from './encodeObjectiveLink'
import { encodeItemLink, ItemLinkMeta } from './encodeItemLink'
import { BuildLinkMeta, encodeBuildLink } from './encodeBuildLink'

type TypeMeta = {
  item: ItemLinkMeta | ItemLinkMeta['id']
  map: IdLinkMeta | IdLinkMeta['id']
  skill: IdLinkMeta | IdLinkMeta['id']
  trait: IdLinkMeta | IdLinkMeta['id']
  recipe: IdLinkMeta | IdLinkMeta['id']
  skin: IdLinkMeta | IdLinkMeta['id']
  outfit: IdLinkMeta | IdLinkMeta['id']
  objective: ObjectiveLinkMeta | ObjectiveLinkMeta['id']
  build: BuildLinkMeta
}

export function encode<Type extends CodeType>(type: Type, data: TypeMeta[Type]): string | false {
  const codeType = type.trim().toLowerCase() as CodeType

  // Normalize into a meta object if only the ID was passed
  const meta = typeof data !== 'object' ? { id: data } : data

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
