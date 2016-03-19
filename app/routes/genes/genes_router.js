!function(){
  angular.module('App.Genes')
  .config(['$routeProvider',

    function($routeProvider) {
      $routeProvider.
      when('/genes', {
        templateUrl: 'templates/genes_template.html',
        controller: 'genesCtrl',
        controllerAs: 'ctrl'
      }).

      otherwise({
        redirectTo: '/genes'
      });
    }

  ]);

}();