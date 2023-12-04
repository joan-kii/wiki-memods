const request = require('supertest')
const app = require('../app')

describe('Unit testing the /home route', function() {
  it('should return welcome on rendering', async function() {
    const welcome = '<span class="text-muted">wiki</span><span class="fs-3"><span class="text-primary">M</span>e<span class="text-primary">M</span>ods</span>'
    return request(app)
      .get('/')
      .then(function(response){
        expect(response.text).toContain(welcome)
      })
  })
})
