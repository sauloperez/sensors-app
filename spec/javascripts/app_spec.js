describe("SensorApp", function() {
  var app;

  beforeEach(function() {
    app = window.SensorApp;
  });

  it("should be available", function() {
    expect(app).toBeDefined();
  });

  it("should have a header region", function() {
    expect(app.headerRegion).toBeDefined();
  });

  it("should have a main region", function() {
    expect(app.mainRegion).toBeDefined();
  });
});
