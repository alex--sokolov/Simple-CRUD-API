import { server } from './app';
import { UserId } from './interfaces';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('Test 2', () => {
  afterAll(async () => {
    await server.close();
  });

  let userId: UserId;

  describe('Create new user with less parameters', () => {
    test('user is not created, because age was not specified', async () => {
      const response = await request(server)
        .post('/api/users')
        .send({
          username: 'Joe Biden',
          hobbies: ['politics', 'LGBTQ+ defender'],
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Looks like you didn't specify all the parameters");
    });
  });
  describe('Find user by id, providing wrong id', () => {
    test('there is no user with specified id', async () => {
      const response = await request(server).get(`/api/users/${uuidv4()}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User was not found');
    });
  });
  describe('Create new user', () => {
    test('user is created successfully with all specified fields', async () => {
      const response = await request(server)
        .post('/api/users')
        .send({
          username: 'Joe Biden',
          age: 79,
          hobbies: ['politics', 'LGBTQ+ defender']
        });

      const { newUser } = response.body;
      userId = newUser.id;
      expect(response.statusCode).toBe(201);
      expect(newUser.username).toBe('Joe Biden');
      expect(newUser.age).toBe(79);
      expect(newUser.hobbies).toEqual(['politics', 'LGBTQ+ defender']);
    });
  });

  describe('Update our user with no parameters', () => {
    test('update our user without providing any parameters', async () => {
      const response = await request(server)
        .put(`/api/users/${userId}`)
        .send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('You need to specify at least 1 parameter to change!');
    });
  });
  describe('Try to provide wrong url', () => {
    test('just a wrong url', async () => {
      const response = await request(server).delete(`/api/some-wrong-url`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Oh my gosh! You've entered a wrong path");
    });
  });

  describe('Trying to delete with not validate id', () => {
    test(`the id is not valid`, async () => {
      const fakeId = '777';
      const response = await request(server).delete(`/api/users/${fakeId}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        `The id, that you've entered (${fakeId}), is not valid! It must be of type uuidv4`
      );
    });
  });
});