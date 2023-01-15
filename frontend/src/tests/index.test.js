import { rootRender } from '../index'

const fakeView = '<div>a fake rendered view</div>'

jest.mock('axios', () => ({
  create: jest.fn(),
}))

jest.mock('react-dom/client', () => ({
  render: jest.fn(),
  createRoot: jest.fn().mockImplementation(() => ({
    render: jest.fn(() => fakeView),
  })),
}))

describe('index.js', () => {
  afterEach(() => jest.clearAllMocks())

  it('ReactDOM renders without crashing', () => {
    expect(rootRender).toBe(fakeView)
  })
})
