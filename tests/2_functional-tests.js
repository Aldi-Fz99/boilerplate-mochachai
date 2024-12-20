const chai = require("chai");
const assert = chai.assert;

const server = require("../server");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);
  suite('GET /hello?name=[name] => "hello [name]"', function () {
    // #1
    test("?name=Guest", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello?name=Guest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Guest");
          done();
        });
    });
    // #2
    test("?name=aldi", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello?name=aldi")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello aldi");
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({ surname: "Colombo" })

        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.name, "Cristoforo");
          assert.equal(res.body.surname, "Colombo");

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({ surname: "da Verrazzano" })

        .end((req, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.name, "Giovanni");
          assert.equal(res.body.surname, "da Verrazzano");

          done();
        });
    });
  });
});

const Browser = require("zombie");

// Menambahkan URL proyek ke dalam properti 'site'
Browser.site = "http://0.0.0.0:3000"; // Ganti dengan URL proyek Anda

suite("Functional Tests with Zombie.js", function () {
  this.timeout(5000);

  // Membuat contoh objek baru dari Browser
  const browser = new Browser();

  // Setup untuk mengunjungi halaman root sebelum menjalankan tes
  suiteSetup(function (done) {
    return browser.visit("/", done);
  });

  suite("Headless browser", function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill("surname", "Colombo").then(() => {
        browser.pressButton("submit", () => {
          browser.assert.success();
          browser.assert.text("span#name", "Cristoforo");
          browser.assert.text("span#surname", "Colombo");
          browser.assert.elements("span#dates", 1);
          done();
        });
      });
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill("surname", "Vespucci").then(() => {
        browser.pressButton("submit", () => {
          browser.assert.success();
          browser.assert.text("span#name", "Amerigo");
          browser.assert.text("span#surname", "Vespucci");
          browser.assert.elements("span#dates", 1);
          done();
        });
      });
    });
  });
});
