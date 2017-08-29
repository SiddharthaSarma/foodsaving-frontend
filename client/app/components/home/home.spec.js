import HomeModule from "./home";

const { module } = angular.mock;

describe("Home", () => {
  beforeEach(() => {
    module(HomeModule);
  });

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named home", () => {
      expect(HomeModule).to.equal("home");
    });
  });

  describe("Controller", () => {
    let $componentController, $httpBackend, SessionUser;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");
      SessionUser = $injector.get("SessionUser");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    let groupData = [
      { id: 50 },
      { id: 99 }
    ];

    it("should redirect user to current group when possible", () => {
      SessionUser.value = { current_group: 3 };                       //eslint-disable-line
      let $ctrl = $componentController("home", {});
      sinon.stub($ctrl.$state, "go");
      $ctrl.$onInit();
      expect($ctrl.$state.go).to.have.been.calledWith("group", { groupId: SessionUser.value.current_group });
    });

    it("should redirect user to first group if current group is null", () => {
      SessionUser.value = { id: 1, current_group: null };             //eslint-disable-line
      $httpBackend.expectGET("/api/groups/?members=1").respond(200, groupData);
      let $ctrl = $componentController("home", {});
      sinon.stub($ctrl.$state, "go");
      $ctrl.$onInit();
      $httpBackend.flush();
      expect($ctrl.$state.go).to.have.been.calledWith("group", { groupId: 50 });
    });

    it("redirects to group list if user is in no group", () => {
      SessionUser.value = { id: 1, current_group: null };             //eslint-disable-line
      $httpBackend.expectGET("/api/groups/?members=1").respond(200, []);
      let $ctrl = $componentController("home", {});
      sinon.stub($ctrl.$state, "go");
      $ctrl.$onInit();
      $httpBackend.flush();
      expect($ctrl.$state.go).to.have.been.calledWith("joinGroupList");
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<home></home>")(scope);
    });
  });
});
