const request = require('supertest')
const app = require('../app')

describe('Unit testing the /articles route', function() {
  it('should return title on rendering', async function() {
    return request(app)
      .get('/articles')
      .then(function(response){
        expect(response.text).toContain('Nope')
      })
  })
})
