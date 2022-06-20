import request from 'supertest';
import { server } from './app';
import { IUser, UserId } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

describe('Test 1', () => {
  afterAll(async () => {
    await server.close();
  });

  let user: IUser;
  let userId: UserId;
  describe('Create new user', () => {
    test('user is created successfully with all specified fields', async () => {
      const response = await request(server)
        .post('/api/users')
        .send({
          username: 'Joe Biden',
          age: 79,
          hobbies: ['politics', 'LGBTQ+ defender'],
        });

      const { newUser } = response.body;
      user = { ...newUser };
      userId = newUser.id;
      expect(response.statusCode).toBe(201);
      expect(newUser.username).toBe('Joe Biden');
      expect(newUser.age).toBe(79);
      expect(newUser.hobbies).toEqual(['politics', 'LGBTQ+ defender']);
    });
  });
  describe('Find created user by id', () => {
    test('user is in our dataBase and we can get him any time', async () => {
      const response = await request(server).get(`/api/users/${userId}`);
      const userFetched = response.body;
      userId = response.body.id;
      expect(response.statusCode).toBe(200);
      expect(userFetched.id).toBe(user.id);
      expect(userFetched.username).toBe(user.username);
      expect(userFetched.age).toBe(user.age);
      expect(userFetched.hobbies).toEqual(user.hobbies);
    });
  });
  describe('Update our user', () => {
    test('update all the fields of our user except id', async () => {
      const response = await request(server)
        .put(`/api/users/${userId}`)
        .send({
          username: 'Nancy Pelosi',
          age: 82,
          hobbies: ['politics', 'drinking'],
        });
      const { userUpdated } = response.body;
      expect(response.statusCode).toBe(200);
      expect(userUpdated.id).toBe(user.id);
      expect(userUpdated.username).not.toBe(user.username);
      expect(userUpdated.age).not.toBe(user.age);
      expect(userUpdated.hobbies).not.toEqual(user.hobbies);
    });
  });
  describe('Get all users', () => {
    test('We can receive all users, there are must be at least 1', async () => {
      const response = await request(server).get(`/api/users`);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
  describe('Delete user', () => {
    test(`Now let's go ahead and delete our user`, async () => {
      const response = await request(server).delete(`/api/users/${userId}`);
      expect(response.statusCode).toBe(204);
    });
  });
  describe('Get user by id', () => {
    test(`Now let's make sure, that user was deleted`, async () => {
      const response = await request(server).get(`/api/users/${userId}`);
      expect(response.statusCode).toBe(404);
    });
  });
});
