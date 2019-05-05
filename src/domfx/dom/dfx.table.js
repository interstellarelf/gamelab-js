

class Table extends MagicDom {
  constructor(args={}) {
    super(args);

      this.domElement = document.createElement('table');

      this.cols = [];
  }

  Heading(v){
    var th = dfx.Tag('TH');

  }

  addRow(){
    var tr = dfx.Tag('TR');

  }

  addData(row_index, column_index) {
        var tr = dfx.Tag('TD');

  }
};
