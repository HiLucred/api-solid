import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('shoud be able to authenticated', async () => {
    await usersRepository.create({
      name: 'Gabriel',
      email: 'gab@example.com',
      password_hash: await hash('1234567', 6),
    })

    const { user } = await sut.execute({
      email: 'gab@example.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('shoud not be able to authenticated with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'gab@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('shoud not be able to authenticated with wrong password', async () => {
    await usersRepository.create({
      name: 'Gabriel',
      email: 'gab@example.com',
      password_hash: await hash('1234567', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'gab@example.com',
        password: '7654321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
