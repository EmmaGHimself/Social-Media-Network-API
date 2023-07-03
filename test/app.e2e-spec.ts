import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupTestDatabase } from '../src/config/test-setup';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let postId: number;
  let commentId: number;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

      // Call the setupTestDatabase function here
  await setupTestDatabase();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'John Doe', username: 'john', password: 'password123' })
      .expect(201);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john', password: 'password123' })
      .expect(200)
      .then((response) => {
        const { token } = response.body;
        accessToken = token;
      });
  });

  it('/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/posts (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'This is a test post' })
      .expect(201)
      .then((response) => {
        const { id } = response.body;
        postId = id;
      });
  });


  it('/posts/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts/' + postId) // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/posts/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/posts/' + postId) // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'This post has been updated' })
      .expect(200);
  });

  it('/posts/:id/like (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts/'+ postId + '/like') // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/posts/:id/unlike (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts/' + postId + '/unlike') // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/posts/:id/comments (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts/' + postId +'/comments') // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'This is a comment on the post' })
      .expect(201)
      .then((response) => {
        const { id } = response.body;
        commentId = id;
      });
  });

  it('/posts/comments/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/posts/comments/' + postId) // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'This comment has been updated' })
      .expect(200);
  });

  it('/posts/comments/:id/like (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts/comments/'+ commentId + '/like') // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/posts/comments/:id/unlike (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts/comments/' + commentId + '/unlike') // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/posts/comments/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/posts/comments/' + commentId) // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });


  it('/posts/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/posts/' + postId) // Replace 1 with a valid post ID
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

});
