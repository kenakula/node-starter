import { describe, test } from '@jest/globals';
import { DefaultRoute } from '@app/routes';
import { App } from '@app/app';
import request from 'supertest';

describe('Default tests', () => {
  describe('[GET] /default', () => {
    test('should respond with 200 status', () => {
      const app = new App([new DefaultRoute()]);

      return request(app.getServer()).get('/default').expect(200);
    });
  });
});
