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