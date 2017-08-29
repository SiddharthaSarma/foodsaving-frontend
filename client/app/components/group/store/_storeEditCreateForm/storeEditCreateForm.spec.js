import StoreEditCreateFormModule from "./storeEditCreateForm";

const { module } = angular.mock;

describe("StoreEditCreateForm", () => {
  beforeEach(module(StoreEditCreateFormModule));
  beforeEach(module({ translateFilter: (a) => a }));

  let $log;
  beforeEach(inject(($injector) => {
    $log = $injector.get("$log");
    $log.reset();
  }));
  afterEach(() => {
    $log.assertEmpty();
  });

  describe("Module", () => {
    it("is named storeEditCreateForm", () => {
      expect(StoreEditCreateFormModule).to.equal("storeEditCreateForm");
    });
  });

  describe("Controller", () => {
    let $componentController, $q, $rootScope;
    beforeEach(inject(($injector) => {
      $componentController = $injector.get("$componentController");
      $q = $injector.get("$q");
      $rootScope = $injector.get("$rootScope");
    }));

    it("initializes from binding", () => {
      let $ctrl = $componentController("storeEditCreateForm", {}, { data: {
        latitude: 2, longitude: 3, address: "he"
      } });
      $ctrl.$onInit();
      expect($ctrl.isCreate).to.be.undefined;
    });

    it("initializes without binding", () => {
      let $ctrl = $componentController("storeEditCreateForm", {});
      $ctrl.$onInit();
      expect($ctrl.isCreate).to.be.true;
    });

    it("submits data with error", () => {
      let $ctrl = $componentController("storeEditCreateForm", {});
      let err = { data: "err" };
      $ctrl.onSubmit = () => $q.reject(err);
      $ctrl.submit();
      $rootScope.$apply();
      expect($ctrl.error).to.be.equal("err");
    });
  });

  describe("directive", () => {
    let scope, $componentController, el, StoreService, $q, ngModel;

    beforeEach(() => {
      inject(($injector, $rootScope, $compile) => {
        scope = $rootScope.$new();
        $componentController = $injector.get("$componentController");
        scope.$ctrl = $componentController("storeEditCreateForm", {}, {
          data: {
            name: "testname",
            group: 1,
            id: 1
          }
        });
        $q = $injector.get("$q");
        StoreService = $injector.get("StoreService");
        el = angular.element(
          "<input type='text' name='name' ng-model='$ctrl.data.name' storename-Validator/>"
        );
        $compile(el)(scope);
      });
      ngModel = el.controller("ngModel");
    });

    it("should reject if store name already exists", () => {
      sinon.stub(StoreService, "listStoresInGroupByName").returns($q((resolve) => {
        resolve([{ id: 2 }]);
      }));
      ngModel.$setViewValue("testname");
      scope.$digest();
      expect(StoreService.listStoresInGroupByName).to.have.been.calledWith(1,"testname");
      expect(ngModel.$valid).to.be.false;
    });

    it("should allow if store name does not exist", () => {
      sinon.stub(StoreService, "listStoresInGroupByName").returns($q((resolve) => {
        resolve([]);
      }));
      ngModel.$setViewValue("testname");
      scope.$digest();
      expect(StoreService.listStoresInGroupByName).to.have.been.calledWith(1,"testname");
      expect(ngModel.$valid).to.be.true;
    });

    it("should allow the same store name if the returned value is the same store", () => {
      //this will occur when the user is editing the name of the store
      sinon.stub(StoreService, "listStoresInGroupByName").returns($q((resolve) => {
        resolve([{ id: 1 }]);
      }));
      ngModel.$setViewValue("testname");
      scope.$digest();
      expect(StoreService.listStoresInGroupByName).to.have.been.calledWith(1,"testname");
      expect(ngModel.$valid).to.be.true;
    });
  });

  describe("Component", () => {
    let $compile, scope;
    beforeEach(inject(($rootScope, $injector) => {
      $compile = $injector.get("$compile");
      scope = $rootScope.$new();
    }));

    it("compiles component", () => {
      $compile("<store-edit-create-form></store-edit-create-form>")(scope);
    });
  });
});
