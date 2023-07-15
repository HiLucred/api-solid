import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('shoud be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      user_id: 'user-id-01',
      gym_id: 'gym-id-01',
    })

    await checkInsRepository.create({
      user_id: 'user-id-01',
      gym_id: 'gym-id-02',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-id-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id-01' }),
      expect.objectContaining({ gym_id: 'gym-id-02' }),
    ])
  })

  it('shoud be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: `user-id-01`,
        gym_id: `gym-id-${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-id-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id-21' }),
      expect.objectContaining({ gym_id: 'gym-id-22' }),
    ])
  })
})
