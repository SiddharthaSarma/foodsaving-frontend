import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import Authentication from "../../services/authentication/authentication";
import joinGroupListComponent from "./joinGroupList.component";

let joinGroupListModule = angular.module("joinGroupList", [
  uiRouter,
  Authentication
])

.component("joinGroupList", joinGroupListComponent)

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state("joinGroupList", {
      parent: "main",
      url: "/join-group",
      component: "joinGroupList",
      resolve: {
        groups: (GroupService) => {
          return GroupService.list();
        }
      },
      ncyBreadcrumb: {
        label: "{{ 'JOINGROUP.WHICHGROUP' | translate }}"
      }
    });
})

.name;

export default joinGroupListModule;
