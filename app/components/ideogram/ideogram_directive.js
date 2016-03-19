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

