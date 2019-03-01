import AsideData from '@/menu/aside.json'

describe('aside.json', () => {
  it('the json must be right', () => {
    expect(AsideData instanceof Array).toBeTruthy()
  })
})
