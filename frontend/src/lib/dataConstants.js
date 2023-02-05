const defaultNFTCollectionsLimit = 8
const defaultAssetsLimit = 8

const collectionTypes = ['image', 'video', 'audio', 'document']

const statuses = ['draft', 'published', 'archived']

const collectionTypeLabelColors = {
  image: '#d1ccbf',
  video: '#e09722',
  audio: '#fac427',
  document: '#b7a59a',
}

const generatorStyles = [
  'text2img',
  'cute-creature-generator',
  'fantasy-world-generator',
  'old-style-generator',
  'pop-art-generator',
  'pixel-art-generator',
]

const MINTING_STATUSES = {
  not_minted: 'not_minted',
  minted: 'minted',
  minting: 'minting',
}

export {
  defaultNFTCollectionsLimit,
  defaultAssetsLimit,
  collectionTypes,
  collectionTypeLabelColors,
  statuses,
  generatorStyles,
  MINTING_STATUSES,
}
