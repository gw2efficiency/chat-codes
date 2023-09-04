export type CodeType =
  | 'item'
  | 'map'
  | 'skill'
  | 'trait'
  | 'recipe'
  | 'skin'
  | 'outfit'
  | 'objective'
  | 'build'

export const TYPE_HEADERS: { [key in CodeType]: number } = {
  item: 0x02,
  map: 0x04,
  skill: 0x06,
  trait: 0x07,
  recipe: 0x09,
  skin: 0x0a,
  outfit: 0x0b,
  objective: 0x0c,
  build: 0x0d,
}

export const ITEM_FLAGS = {
  skin: 0x80,
  upgrade1: 0x40,
  upgrade2: 0x20,
}

export const PROFESSION_FLAGS = {
  ranger: 0x04,
  revenant: 0x09,
}
