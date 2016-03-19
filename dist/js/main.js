!function() {
  angular.module('App.Genes', []);

  var App = angular.module('App', [
    'ngRoute',
    'App.Genes'
  ]);

}();
!function(){

  angular.module('App')
  .factory('d3Service', ['$document', '$q', '$rootScope',



    function($document, $q, $rootScope) {

      var d = $q.defer();

      function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() { d.resolve(window.d3); });
      }

      // Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');

      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = 'http://d3js.org/d3.v3.min.js';

      scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
      };

      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);






      return {
        d3: function() { return d.promise; }
      };

    }








  ]);

}();
!function(){
  angular.module('App.Genes')
  .service('geneService', ['$q', '$http', function($q, $http){

    var url = 'https://api.solvebio.com/v1/datasets/ISCN/1.1.0-2015-01-05/Ideograms/data?access_token=98e8f6ba570311e4bab59f6dc3060e21';

    var getGeneData = function(geneName){
      var deferred = $q.defer();
      var dataUrl = url + geneName;

      $http.get(dataUrl)
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(error){
          deferred.reject(error);
        });

      return deferred.promise;
    };


    // Return band data for chromosome
    // @param {String} chromosome_id - Chromosome id
    var getIdeogramData = function(chromosome_id){
      var deferred = $q.defer();
      var url = 'https://api.solvebio.com/v1/datasets/115/data';

      var data_1 = {
        'fields': [
          "arm",
          "band_label",
          "genomic_coordinates.start",
          "genomic_coordinates.stop",
          "density"
        ],
        'filters': [{and: [
          ["genomic_coordinates.chromosome", chromosome_id],
          ["band_level", "550"]
        ]}]
      };

      var data_2 = {"filters":null,"genome_build":"GRCh37","limit":30,"offset":30,"query":"","catchErrors":true};

      var req = {
        method: 'POST',
        url: url,
        headers: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imlvbm94MEBnbWFpbC5jb20iLCJkb21haW4iOiJpYW4tam9obnNvbiIsImlzX3N0YWZmIjpmYWxzZSwidXNlcl9pZCI6MTcxOSwiZXhwIjoxNDU5Njk3NDQ0LCJmbGFncyI6e30sInJvbGUiOiJwcmltYXJ5X293bmVyIiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJlbWFpbCI6Imlvbm94MEBnbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6WyJhY2NvdW50cy52aWV3X2JpbGxpbmciLCJhY2NvdW50cy5jYW5fc2VuZF9pbnZpdGVzIiwiYWNjb3VudHMuZWRpdF9zZXR0aW5ncyIsImFjY291bnRzLnZpZXdfc2V0dGluZ3MiLCJhY2NvdW50cy5lZGl0X2F1dGhfc2V0dGluZ3MiLCJhY2NvdW50cy5jYW5fcG9zdF9wdXRfcGF0Y2giLCJhY2NvdW50cy5jYW5fbWFuYWdlX2NyZWRlbnRpYWxzIiwiYWNjb3VudHMubWFuYWdlX21lbWJlcnMiLCJhY2NvdW50cy5hc3NpZ25fcHJpbWFyeV9vd25lciIsImFjY291bnRzLnZpZXdfbWVtYmVycyIsImFjY291bnRzLmFjY2Vzc19hcGkiLCJhY2NvdW50cy5lZGl0X2JpbGxpbmciXX0.a-99IQ1Pz1xmdI5GP8As9KAkc_sxsugwKrnLduuFr1o',
        data: data_1
      };

      $http(req)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(error){
          console.log(error);
        });

      return deferred.promise;
    };


    return {
      getGeneData:      getGeneData,
      getIdeogramData:  getIdeogramData
    }


  }]);
}();
angular.module('App')
.directive('ideogram', ['$window', 'd3Service', function($window, d3Service){

  return {
    scope: {
      geneData: '='
    },

    link: function(scope, $elem){

      var win_width = angular.element($window)[0].innerWidth;

      window.onresize = function() {
        scope.$apply();
      };
      scope.$watch(function() {
        return angular.element($window)[0].innerWidth;
      }, function() {
        _updateWidth();
      });
      scope.$watch(function(){
        return scope.geneData;
      }, function(){
        _render(scope.geneData);
      });

      var svg = d3.select($elem[0])
        .append("svg")
        .style('width', '100%');

      // Scale by the longest stop value
      var max_stop = 260000000;
      var gc = 'genomic_coordinates';

      var _render = function(data) {
        var results = data.results;

        var arm_p = results.filter(function(r){return r.arm === 'p'});
        var arm_q = results.filter(function(r){return r.arm === 'q'});

        var min_p_value = Math.min.apply(Math, arm_p.map(function(o){ return o[gc].start }));
        var min_p = results.find(function(o){ return o[gc].start == min_p_value });
        var max_p_value = Math.max.apply(Math, arm_p.map(function(o){ return o[gc].stop }));
        var max_p = results.find(function(o){ return o[gc].stop == max_p_value });

        var min_q_value = Math.min.apply(Math, arm_q.map(function(o){ return o[gc].stop }));
        var min_q = results.find(function(o){ return o[gc].stop == min_q_value });
        var max_q_value = Math.max.apply(Math, arm_q.map(function(o){ return o[gc].stop }));
        var max_q = results.find(function(o){ return o[gc].stop == max_q_value });

        results.splice(results.indexOf(min_p), 1);
        results.splice(results.indexOf(max_p), 1);
        results.splice(results.indexOf(min_q), 1);
        results.splice(results.indexOf(max_q), 1);

        var y = 25;
        var h = 50;

        d3Service.d3().then(function() {
          svg.selectAll("rect").remove();
          svg.selectAll('path').remove();

          svg.selectAll("rect")
            .data(results)
            .enter()
            .append("rect")
            .attr("x", function(d) {
              return _scaleX(d[gc].start);
            })
            .attr("width", function(d){
              return _scaleWidth(d[gc].start, d[gc].stop);
            })
            .attr("y", y)
            .attr("height", h)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", function(d){ return "rgb(0,0," + d.density + ")"});

          // Rounded sections
          svg.append("path")
            .attr("d", _leftRoundedRect(_scaleX(min_p[gc].start), y, _scaleWidth(min_p[gc].start, min_p[gc].stop), h, 10))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", function(d){ return "rgb(0,0," + min_p.density + ")"});
          svg.append("path")
            .attr("d", _rightRoundedRect(_scaleX(max_p[gc].start), y, _scaleWidth(max_p[gc].start, max_p[gc].stop), h, 10))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", function(d){ return "rgb(0,0," + max_p.density + ")"});
          svg.append("path")
            .attr("d", _leftRoundedRect(_scaleX(min_q[gc].start), y, _scaleWidth(min_q[gc].start, min_q[gc].stop), h, 10))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", function(){ return "rgb(0,0," + min_q.density + ")"});
          svg.append("path")
            .attr("d", _rightRoundedRect(_scaleX(max_q[gc].start), y, _scaleWidth(max_q[gc].start, max_q[gc].stop), h, 10))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", function(){ return "rgb(0,0," + max_q.density + ")"});
        });
      };

      var _updateWidth = function(){
        win_width = angular.element($window)[0].innerWidth;
        svg.selectAll("rect")
          .attr("x", function(d) {
            return _scaleX(d[gc].start);
          })
          .attr("width", function(d){
            return _scaleWidth(d[gc].start, d[gc].stop);
          });
      };
      function _scaleX(start){
        return win_width * start / max_stop;
      }
      function _scaleWidth(start, stop){
        return win_width * (stop - start) / max_stop;
      }

      function _leftRoundedRect(x, y, width, height, radius) {
        a = "M" + (x + width) + "," + y
          + "h" + (radius - width)
          + "a" + radius + "," + radius + " 0 0 0 " + -radius + "," + radius
          + "v" + (height - 2 * radius)
          + "a" + radius + "," + radius + " 0 0 0 " + radius + "," + radius
          + "h" + (width - radius)
          + "z";
        return a;
      }
      function _rightRoundedRect(x, y, width, height, radius) {
        a = "M" + x + "," + y
          + "h" + (width - radius)
          + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
          + "v" + (height - 2 * radius)
          + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
          + "h" + (radius - width)
          + "z";
        return a;
      }

    }
  }

}]);


!function(){
  angular.module('App.Genes')
  .controller('genesCtrl', ['geneService', 'd3Service', function(geneService, d3Service){

    var ctrl = this;

    function _init(){
      ctrl.genesList = ['1','2','3','4','5','6',
        '7','8','9','10','11','12','13','14','15',
        '16','17','18','19','20','21',
        'x','y'
      ];
      ctrl.selectedGene = ctrl.genesList[0];
      ctrl.chooseGene();
    }

    ctrl.chooseGene = function(chromosome_id){
      geneService.getIdeogramData(chromosome_id)
        .then(function(data){
          ctrl.geneData = data;
        });
    };

    _init();

  }]);
}();
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