const supertest = require('supertest');
const app = require('../src/app');
const STORE = require('../src/playstore');

describe('GET /apps endpoint', () => {
  it('should send a list of apps when no params present', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .then(res=>{
        expect(res.body).to.deep.equal(STORE);
      });
  });
  it('should send an error if sort value is not Rating or App', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'jiberish'})
      .expect(400, 'Sort must be of Rating or App');
  });
  it('should send sorted list of apps in alphabeticle order when sort is sent with App', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'App'})
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtI.App > appAtIPlus1.App) {
            sorted = false;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should send a sorted list of apps by rating when sort is sent with Rating', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'Rating'})
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtI.Rating > appAtIPlus1.Rating) {
            sorted = false;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});