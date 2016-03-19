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