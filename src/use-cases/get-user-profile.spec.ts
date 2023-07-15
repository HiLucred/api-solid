import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('shoud be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Gabriel',
      email: 'gab@example.com',
      password_hash: await hash('1234567', 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Gabriel')
  })

  it('shoud not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'not-existin-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
