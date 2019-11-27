const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

// Configure chai
chai.use(chaiHttp);
chai.should();
describe("GET /", () => {
    it("should get content", (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.contain('Hello Janettre!!!!!!!!!!');
                done();
            });
    });
});
