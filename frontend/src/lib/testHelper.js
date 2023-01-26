const fakeUser = {
  _id: '63c551e0ca77037c5a8a017f',
  username: 'abc123',
  firstName: 'Luella',
  lastName: 'Glover',
  walletAddresses: ['57541aa3-11d7-4398-a5db-c3ac2eed517e'],
  avatarUrl:
    'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/297.jpg',
  bannerImageUrl: 'https://loremflickr.com/1024/200/nature',
  bio: 'Aliquid iste soluta harum. Modi nobis sequi laudantium dolorem dolorum consectetur omnis ipsam. Perspiciatis deleniti atque temporibus labore soluta deleniti quisquam. Eos itaque consectetur similique beatae maiores ipsum eveniet. Dolore vitae fugit. Sint perferendis amet vero. Dolore vero sit magnam unde mollitia cum labore. Beatae accusantium dolorem veniam nulla ex earum tempore. Ea quaerat perferendis officiis ipsa molestiae rem hic consequatur.',
  dob: '2015-10-21T10:25:06.923Z',
  createdAt: '2023-01-16T13:32:16.716Z',
  updatedAt: '2023-01-20T11:15:36.637Z',
}

const fakeNftCollection = {
  _id: '63cce9886f124b9e51502125',
  userId: '63c551e0ca77037c5a8a017f',
  name: 'dolor alias adipisci vel cumque labore',
  summary: 'Natus praesentium inventore ab magni eveniet earum.',
  description:
    'Alias quam id. Officiis occaecati molestias. Sed repudiandae aut dolores ea quae autem. Iusto magni et doloribus nesciunt. Natus architecto dicta laudantium saepe repudiandae.',
  collectionTypes: ['document', 'video', 'audio'],
  status: 'published',
  coverImageUrl: 'https://loremflickr.com/640/480/animals',
  bannerImageUrl: 'https://loremflickr.com/1024/200/nature',
  publishedAt: '2022-11-30T17:08:21.681Z',
  __v: 0,
  createdAt: '2023-01-22T07:45:13.371Z',
  updatedAt: '2023-01-22T07:45:13.371Z',
}

const fakeAsset = {
  _id: '63cce991b241f44010e06adf',
  userId: '63c551e0ca77037c5a8a017f',
  nftCollectionId: '63cce9886f124b9e51502125',
  name: 'deserunt recusandae quis rerum quo amet',
  summary: 'Quod dolorem dolorum ipsam explicabo excepturi vel eligendi dolorum nostrum.',
  description:
    'Iure officiis libero sequi vel provident ipsum eius error nobis. Facilis quis ducimus. Atque unde soluta quasi error odit. Incidunt voluptates excepturi natus ut. Numquam neque eveniet dolorum debitis veritatis sapiente quam magnam.',
  assetType: 'image',
  status: 'draft',
  coverImageUrl: 'https://loremflickr.com/640/480/nature',
  assetUrl: 'https://loremflickr.com/640/480/sports',
  tokenDetails: {
    contractAdress: 'b72c0760-a728-4ac3-87d5-133c72b2a66a',
    tokenId: 'd8f53656-b0ec-4f4f-9698-0c65b877dca3',
    tokenStandard: 'ERC-1156',
    chain: 'Ethereum',
    metadata: 'Centralized',
    _id: '63cce991b241f44010e06ae0',
  },
  publishedAt: '2022-12-11T10:27:53.400Z',
  __v: 0,
  createdAt: '2023-01-22T07:45:21.985Z',
  updatedAt: '2023-01-22T07:45:21.985Z',
}

export { fakeUser, fakeNftCollection, fakeAsset }
