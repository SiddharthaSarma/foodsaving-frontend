import GroupEditModule from "./groupEdit";

const { module } = angular.mock;

describe("GroupEdit", () => {
  beforeEach(module(GroupEditModule));
  beforeEach(module({ translateFilter: (a) => a }));
  beforeEach(module(($stateProvider) => {
    // fake state hierarchy for ui-sref='^'
    $stateProvider
    .state("parent", { url: "/" })
    .state("parent.child", { url: "/child" });
  }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named groupEdit", () => {
      expect(GroupEditModule).to.equal("groupEdit");
    });
  });

  describe("Controller", () => {
    let $componentController, $httpBackend;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it("modifies group", () => {
      let $ctrl = $componentController("groupEdit", {});
      let editData = {
        id: 85,
        name: "blabla"
      };
      $ctrl.submit(editData);
      $httpBackend.expectPATCH("/api/groups/85/", editData).respond(200, editData);
      sinon.stub($ctrl.$state, "go");
      $httpBackend.flush();
      expect($ctrl.$state.go).to.have.been.calledWith("^");
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector,$state) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
      $state.go("parent.child");
      $rootScope.$apply();
    }));

    it("compiles component", () => {
      $compile("<group-edit></group-edit>")(scope);
    });
  });
});
