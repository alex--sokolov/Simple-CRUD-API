import { server } from './app';
import { IUser, UserId } from './interfaces';
import request from 'supertest';

describe('Test 3', () => {
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
  describe('Get user by id', () => {
    test(`Now let's make sure, that user was created`, async () => {
      const response = await request(server).get(`/api/users/${userId}`);
      expect(response.statusCode).toBe(200);
    });
  });
  describe('Update user', () => {
    test('update only username of our user', async () => {
      const response = await request(server)
        .put(`/api/users/${userId}`)
        .send({
        username: 'Nancy Pelosi',
      });
      const { userUpdated } = response.body;
      expect(response.statusCode).toBe(200);
      expect(userUpdated.id).toBe(user.id);
      expect(userUpdated.username).not.toBe(user.username);
      expect(userUpdated.age).toBe(user.age);
      expect(userUpdated.hobbies).toEqual(user.hobbies);
    });
  });
  describe('Delete user', () => {
    test(`Now let's go ahead and delete our user`, async () => {
      const response = await request(server).delete(`/api/users/${userId}`);
      expect(response.statusCode).toBe(204);
    });
  });
  describe('Try to find deleted user by id', () => {
    test('user is not in our dataBase and we can not get him anymore', async () => {
      const response = await request(server).get(`/api/users/${userId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User was not found');
    });
  });
  describe('Try to update deleted user', () => {
    test('user is not in our dataBase and we can not update him as well', async () => {
      const response = await request(server)
        .put(`/api/users/${userId}`)
        .send({
        age: 18,
      });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User was not found');
    });
  });
});
