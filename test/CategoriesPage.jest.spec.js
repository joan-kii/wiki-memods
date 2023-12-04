const request = require('supertest')
const app = require('../app')

describe('Unit testing the /categories route', function() {
  it('should return title on rendering', async function() {
    return request(app)
      .get('/')
      .then(function(response){
        expect(response.text).toContain('Categories')
      })
  })
})
