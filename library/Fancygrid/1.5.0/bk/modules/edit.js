/*
 * @mixin Fancy.store.mixin.Edit
 */
Fancy.Mixin('Fancy.store.mixin.Edit', {
  //TODO: too slow for big data, needs redo. Add some map.
  idSeed: 0,
  /*
   * @param {Object} o
   */
  remove: function(o){
    var me = this,
      i = 0,
      iL = me.getTotal(),
      //id = o.id || o.data.id,
      id = o.id,
      index,
      orderIndex,
      itemData;

    switch(Fancy.typeOf(o)){
      case 'string':
      case 'number':
        id = o;
        break;
      default:
        id = o.id || o.data.id;
    }

    if(me.proxyType === 'server' && me.autoSave){
      me.proxyCRUD('DESTROY', id);
      return;
    }

    if(o.rowIndex){
      index = me.dataViewIndexes[o.rowIndex];
      orderIndex = o.rowIndex;
    }
    else{
      //index = o.$index;
      index = me.getDataIndex(id);
      orderIndex = me.getRow(id);
      //TODO: absent orderIndex, need to learn where to take it.
    }

    itemData = me.data.splice(index, 1)[0];

    if(me.paging){
      orderIndex += me.showPage * me.pageSize;
    }

    if(me.order){
      me.order.splice(orderIndex, 1);
    }

    //SLOW, needs all redo to another approach
    //Almost the same as resorting
    if(me.changeOrderIndexes){
      me.changeOrderIndexes(index);
    }

    if(me.paging){
      if(me.showPage !== 0 && me.showPage * me.pageSize === me.getTotal()){
        me.showPage--;
      }
      me.calcPages();
    }

    delete me.map[id];

    me.fire('remove', id, itemData);
    me.changeDataView();
  },
  /*
   * @param {Number} index
   */
  removeAt: function(index){
    //NOT FINISHED!!!
    var me = this;

    me.remove({
      rowIndex: index,
      id: me.getId(index)
    });
  },
  /*
   * @param {Object} o
   * @return {Fancy.Model}
   */
  add: function(o){
    var me = this,
      model = me.model,
      item;

    return me.insert(me.getTotal(), o);
  },
  /*
   * @param {Number} index
   * @param {Object} o
   * @return {Fancy.Model}
   */
  insert: function(index, o){
    var me = this,
      model = me.model;

    me.addIndex = index;

    if(o.id === undefined){
      me.idSeed++;
      if(me.proxyType === 'server'){
        o.id = 'Temp-' + me.idSeed;
      }
      else {
        o.id = me.getTotal() + me.idSeed;
      }
    }

    if(me.getById(o.id)){
      me.remove(o.id);
      //console.log(me.map);
    }

    if(me.proxyType === 'server' && me.autoSave){
      me.once('create', me.onCreate, me);
      me.proxyCRUD('CREATE', o);
    }
    else{
      return me.insertItem(o, index);
    }
  },
  /*
   * @param {Object} o
   * @return {Fancy.Model}
   */
  insertItem: function(o){
    var me = this,
      model = me.model,
      item = new model(o),
      index = me.addIndex;

    delete me.addIndex;
    item.$index = index;
    me.data.splice(index, 0, item);

    if(me.order){
      me.order.splice(index, 0, index);
      me.changeOrderIndexes(index, '+');
      me.order[index]--;
    }

    me.changeDataView();
    me.map[o.id] = item;
    me.fire('insert', item);
    return item;
  },
  /*
   *
   */
  onCreate: function(store, o){
    return this.insertItem(o);
  }
});/*
 * @mixin Fancy.grid.mixin.Edit
 */
Fancy.Mixin('Fancy.grid.mixin.Edit', {
  /*
   * @param {*} o
   * @param {Boolean} at
   */
  remove: function(o, at){
    var me = this,
      store = me.store,
      method = 'remove';

    if(at){
      method = 'removeAt';
    }

    if(Fancy.isArray(o)){
      var i = 0,
        iL = o.length;

      for(;i<iL;i++){
        store[method](o[i]);
      }
    }
    else{
      store[method](o);
    }

    me.setSidesHeight();
  },
  /*
   * @param {*} o
   */
  removeAt: function(o){
    var me = this;

    me.remove(o, true);
  },
  /*
   * @param {*} o
   */
  add: function(o){
    this.store.add(o);
  },
  /*
   * @param {Number} index
   * @param {Object} o
   */
  insert: function(index, o){
    var me = this,
      s = me.store;

    if(Fancy.isArray(o)){
      var i = o.length - 1;

      for(;i !== -1;i--){
        me.insert(o[i], index);
      }

      me.setSidesHeight();
      return;
    }
    else if(Fancy.isArray(index)){
      var i = index.length - 1;

      for(;i !== -1;i--){
        me.insert(index[i], 0);
      }

      me.setSidesHeight();
      return;
    }
    else if(Fancy.isObject(index) && o === undefined){
      o = index;
      index = 0;
    }
    else if(Fancy.isObject(index) && Fancy.isNumber(o)){
      var _index = o;
      o = index;
      index = _index;
    }

    if(me.paging && s.proxyType !== 'server'){
      index += s.showPage * s.pageSize;
    }

    s.insert(index, o);
    me.setSidesHeight();
  },
  /*
   * @param {Number} rowIndex
   * @param {String} key
   * @param {*} value
   */
  set: function(rowIndex, key, value){
    var me = this,
      s = me.store;

    if(Fancy.isObject(key) && value === undefined){
      s.setItemData(rowIndex, key, value);
    }
    else {
      s.set(rowIndex, key, value);
    }
  }
});/*
 * @class Fancy.grid.plugin.Edit
 */
Fancy.define('Fancy.grid.plugin.Edit', {
  extend: Fancy.Plugin,
  ptype: 'grid.edit',
  inWidgetName: 'edit',
  clicksToEdit: 2,
  tabColumnsSupport: {
    date: true,
    combo: true,
    image: true,
    number: true,
    string: true,
    text: true
  },
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this;

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    me.addEvents('tab');

    me.Super('init', arguments);

    w.once('render', function(){
      me.ons();
      s.on('beforeupdate', me.onStoreCRUDBeforeUpdate, me);
      s.on('update', me.onStoreCRUDUpdate, me);

      s.on('beforedestroy', me.onStoreCRUDBeforeDestroy, me);
      s.on('destroy', me.onStoreCRUDDestroy, me);
      s.on('create', me.onCreate, me);
    });
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      clickEventName = 'cell' + me.getClickEventName();

    w.on('cellclick', me.onClickCell, me);
    s.on('set', me.onStoreSet, me);
    me.on('tab', me.onTab, me);

    w.once('init', function(){
      w.on(clickEventName, me.onClickCellToEdit, me);
    });

    w.on('activate', me.onGridActivate, me);
    w.on('deactivate', me.onGridDeActivate, me);
  },
  /*
   *
   */
  onGridActivate: function(){
    var me = this,
      docEl = Fancy.get(document);

    docEl.on('keydown', me.onKeyDown, me);
  },
  /*
   *
   */
  onGridDeActivate: function(){
    var me = this,
      docEl = Fancy.get(document);

    docEl.un('keydown', me.onKeyDown, me);
  },
  /*
   * @param {Object} e
   */
  onKeyDown: function(e){
    var me = this,
      keyCode = e.keyCode,
      key = Fancy.key;

    switch(keyCode) {
      case key.TAB:
        me.fire('tab', e);
        break;
    }
  },
  /*
   * @param {Object} me
   * @param {Object} e
   */
  onTab: function(me, e){
    var me = this,
      w = me.widget,
      activeParams = me.activeCellEditParams;

    if(!activeParams){
      return;
    }

    e.preventDefault();

    var params = me.getNextCellEditParam();

    w.celledit.hideEditor();
    if(w.tabEdit !== false){
      setTimeout(function () {
        w.celledit.edit(params);
      }, 100);
    }
  },
  /*
   *
   */
  getNextCellEditParam: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      activeParams = me.activeCellEditParams,
      rightColumns = w.rightColumns,
      leftColumns = w.leftColumns;

    var columnIndex = activeParams.columnIndex,
      rowIndex = activeParams.rowIndex,
      side = activeParams.side,
      body = w.getBody(side),
      columns = w.getColumns(side),
      nextColumn = columns[columnIndex + 1],
      nextCell,
      key,
      id;

    var i = 0,
      maxRecursion = 20;

    for(;i<maxRecursion;i++){
      var cellInfo = me.getNextCellInfo({
        side: side,
        columnIndex: columnIndex,
        rowIndex: rowIndex
      });

      side = cellInfo.side;
      columnIndex = cellInfo.columnIndex;
      rowIndex = cellInfo.rowIndex;
      columns = w.getColumns(side);
      nextColumn = columns[cellInfo.columnIndex];

      if(me.tabColumnsSupport[nextColumn.type] && nextColumn.editable === true){
        break;
      }
    }

    body = w.getBody(side);
    nextCell = body.getCell(rowIndex, columnIndex).dom;
    if(!nextCell){
      side = 'center';
      if(leftColumns.length){
        side = 'left';
      }

      rowIndex = 0;
      columnIndex = 0;

      body = w.getBody(side);
      nextCell = body.getCell(rowIndex, columnIndex).dom;
    }

    //TODO: function that get next editable cell(checkbox does not suit)
    //maybe in future to learn how ExtJS does it, and checkbox also to add.

    key = nextColumn.index || nextColumn.key;
    id = s.getId(rowIndex);

    return {
      id: s.getId(rowIndex),
      side: side,
      column: nextColumn,
      cell: nextCell,
      columnIndex: columnIndex,
      rowIndex: rowIndex,
      value: s.get(rowIndex, key),
      data: s.get(rowIndex),
      item: s.getById(id)
    };
  },
  /*
   * @param {Object} o
   */
  getNextCellInfo: function(o){
    var me = this,
      w = me.widget,
      side = o.side,
      columns = w.getColumns(side),
      columnIndex = o.columnIndex,
      rowIndex = o.rowIndex,
      nextColumn = columns[columnIndex + 1],
      rightColumns = w.rightColumns,
      leftColumns = w.leftColumns;

    if(nextColumn){
      columnIndex++;
    }
    else{
      switch(side){
        case 'left':
          side = 'center';
          columnIndex = 0;
          break;
        case 'center':
          if(rightColumns.length){
            side = 'right';
            columnIndex = 0;
          }
          else if(leftColumns.length){
            side = 'left';
            columnIndex = 0;
            rowIndex++;
          }
          else{
            columnIndex = 0;
            rowIndex++;
          }
          break;
        case 'right':
          if(leftColumns.length){
            side = 'left';
            columnIndex = 0;
            rowIndex++;
          }
          else{
            side = 'center';
            columnIndex = 0;
            rowIndex++;
          }
          break;
      }
    }

    return {
      side: side,
      rowIndex: rowIndex,
      columnIndex: columnIndex
    }
  },
  /*
   *
   */
  getClickEventName: function(){
    var me = this;

    if(me.clicksToEdit === 1){
      return 'click';
    }

    if(me.clicksToEdit === 2){
      return 'dblclick';
    }
  },
  /*
   *
   */
  stopEditor: function(){
    var me = this;

    me.stopped = true;
  },
  /*
   * @param {Object} grid
   * @param {Object} o
   */
  onClickCell: function(grid, o){
    var me = this,
      w = me.widget,
      column = o.column,
      columnType = column.type;

    if(column.editable && column.type === 'checkbox'){
      w.celledit.onCheckBoxChange(o);
    }
  },
  /*
   * @param {Object} grid
   * @param {Object} o
   */
  onClickCellToEdit: function(grid, o){
    var me = this,
      w = me.widget,
      column = o.column,
      columnType = column.type;

    if(w.rowedit){

    }
    else{
      w.celledit.hideEditor();
    }

    me.fire('beforedit');

    if(me.stopped === true){
      me.stopped = false;
      return;
    }

    if(w.rowedit){
      w.rowedit.edit(o);
    }
    else if(column.editable && column.type !== 'checkbox'){
      w.celledit.edit(o);
    }
  },
  /*
   * @param {Fancy.Store} store
   * @param {Object} o
   */
  onStoreSet: function(store, o){
    var me = this,
      w = me.widget;

    w.updater.updateRow(o.rowIndex);
  },
  /*
   *
   */
  onStoreCRUDBeforeUpdate: function(){
    var me = this,
      w = me.widget,
      o = me.activeCellEditParams,
      cellEl = Fancy.get(o.cell);

    cellEl = Fancy.get(o.cell);

    w.updater.updateRow(o.rowIndex);
    if(cellEl.hasClass('fancy-grid-cell-dirty') === false){
      //cellEl.addClass('fancy-grid-cell-dirty');
      //cellEl.append('<div class="fancy-grid-cell-dirty-el"></div>');
    }
  },
  /*
   *
   */
  onStoreCRUDUpdate: function(){
    var me = this,
      w = me.widget,
      o = me.activeCellEditParams,
      cellEl = Fancy.get(o.cell);

    me.clearDirty();
  },
  /*
   *
   */
  onStoreCRUDBeforeDestroy: function(){

  },
  /*
   *
   */
  onStoreCRUDDestroy: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    s.loadData();
    me.clearDirty();
  },
  /*
   *
   */
  clearDirty: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    setTimeout(function() {
      w.leftBody.clearDirty();
      w.body.clearDirty();
      w.rightBody.clearDirty();
    }, 500);
  },
  /*
   * @param {Object} store
   * @param {Array} data
   */
  onCreate: function(store, data){
    var me = this,
      w = me.widget,
      s = w.store;

    w.updater.update();
    me.clearDirty();
  }
});/*
 * @class Fancy.grid.plugin.CellEdit
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.CellEdit', {
  extend: Fancy.Plugin,
  ptype: 'grid.celledit',
  inWidgetName: 'celledit',
  /*
   * @constructor
   * @param config
   */
  constructor: function(config){
    var me = this;

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.Super('init', arguments);

    me.ons();
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    w.once('render', function(){
      me.initEditorContainer();
      w.on('scroll', me.onScroll, me);
      w.on('docclick', me.onDocClick, me);
      w.on('headercellmousedown', me.onHeaderCellMouseDown, me);
    });
  },
  /*
   * @param {Object} grid
   * @param {Object} e
   */
  onDocClick: function(grid, e){
    var me = this,
      o = me.activeCellEditParams,
      editor = me.activeEditor,
      inCombo = true;

    if(editor === undefined || o.column.type !== 'combo'){
      return;
    }

    var target = e.target;

    if(editor.el.within(target) === false && editor.list.within(target) === false && me.comboClick !== true){
      inCombo = false;
    }

    if(inCombo === false){
      editor.hide();
    }

    me.comboClick = false;
  },
  /*
   *
   */
  initEditorContainer: function(){
    var me = this,
      w = me.widget;

    me.editorsContainer = w.el.select('.fancy-grid-editors');
  },
  /*
   * @param {Object} o
   */
  edit: function(o){
    var me = this,
      w = me.widget,
      column = o.column,
      columnType = column.type;

    if(column.index === '$selected'){
      return;
    }

    me.activeCellEditParams = o;
    w.edit.activeCellEditParams = o;

    column.editor = me.generateEditor(column);

    //me.hideEditor();
    w.scroller.scrollToCell(o.cell);
    me.showEditor(o);
  },
  /*
   * @param {Object} column
   */
  generateEditor: function(column){
    var me = this,
      w = me.widget,
      style = {
        position: 'absolute',
        left: '0px',
        top: '0px',
        display: 'none',
        padding: '0px'
      },
      type = column.type,
      editor,
      vtype = column.vtype,
      renderTo,
      theme = w.theme;

    if(column.editor){
      return column.editor;
    }

    renderTo = me.editorsContainer.dom;

    var itemConfig = {
      renderTo: renderTo,
      label: false,
      style: style
    };

    switch(type){
      case 'combo':
        var data = me.configComboData(column.data);

        if(theme === 'default'){
          theme = undefined;
        }

        editor = new Fancy.Combo({
          theme: theme,
          renderTo: renderTo,
          label: false,
          style: style,
          data: data,
          displayKey: 'valueText',
          valueKey: 'index',
          value: 0,
          padding: false,
          vtype: vtype,
          events: [{
            change: me.onComboChange,
            scope: me
          }]
        });
        break;
      case 'text':
        editor = new Fancy.TextArea({
          renderTo: renderTo,
          label: false,
          style: style,
          vtype: vtype,
          events: [{
            enter: me.onEditorEnter,
            scope: me
          },{
            beforehide: me.onEditorBeforeHide,
            scope: me
          },{
            blur: me.onBlur,
            scope: me
          }]
        });
        break;
      case 'image':
      case 'string':
        editor = new Fancy.StringField({
          renderTo: renderTo,
          label: false,
          style: style,
          vtype: vtype,
          format: column.format,
          events: [{
            enter: me.onEditorEnter,
            scope: me
          },{
            beforehide: me.onEditorBeforeHide,
            scope: me
          },{
            blur: me.onBlur,
            scope: me
          }]
        });
        break;
      case 'number':
      case 'currency':
        Fancy.apply(itemConfig, {
          vtype: vtype,
          format: column.format,
          events: [{
            enter: me.onEditorEnter,
            scope: me
          },{
            beforehide: me.onEditorBeforeHide,
            scope: me
          },{
            blur: me.onBlur,
            scope: me
          }]
        });

        if(column.spin){
          itemConfig.spin = column.spin;
        }

        if(column.step){
          itemConfig.step = column.step;
        }

        if(column.min){
          itemConfig.min = column.min;
        }

        if(column.max){
          itemConfig.max = column.max;
        }

        editor = new Fancy.NumberField(itemConfig);
        break;
      case 'date':
        editor = new Fancy.DateField({
          renderTo: renderTo,
          label: false,
          style: style,
          format: column.format,
          lang: w.lang,
          vtype: vtype,
          theme: theme,
          events: [{
            enter: me.onEditorEnter,
            scope: me
          },{
            beforehide: me.onEditorBeforeHide,
            scope: me
          },{
            blur: me.onBlur,
            scope: me
          }]
        });

        break;
      default:
        throw new Error('[FancyGrid error] - type ' + type + ' editor does not exit');
    }

    return editor;
  },
  /*
   * @param {Array} data
   * @return {Array}
   */
  configComboData: function(data){
    var i = 0,
      iL = data.length,
      _data = [];

    if(Fancy.isObject(data)){
      return data;
    }

    for(;i<iL;i++){
      _data.push({
        index: i,
        valueText: data[i]
      });
    }

    return _data;
  },
  /*
   * @param {Object} o
   */
  showEditor: function(o){
    var me = this,
      w = me.widget,
      column = o.column,
      type = column.type,
      //editor = me[type + 'Editor'],
      editor = column.editor,
      cell = o.cell,
      cellXY = me.getCellPosition(cell),
      cellSize = me.getCellSize(cell);

    if(type === 'combo'){
      me.comboClick = true;
    }

    me.activeEditor = editor;
    me.setEditorValue(o);
    me.setEditorSize(cellSize);
    editor.show();
    editor.el.css(cellXY);

    //if(type !== 'combo'){
    editor.focus();
    //}

    w.fire('startedit', o);
  },
  /*
   * @param {Number} side
   */
  setEditorSize: function(size){
    var me = this;

    if(me.activeEditor.wtype === 'field.combo'){
      me.activeEditor.size(size);
    }
    else {
      me.activeEditor.setInputSize({
        width: size.width,
        height: size.height
      });
    }
  },
  /*
   *
   */
  hideEditor: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      key,
      value,
      o = me.activeCellEditParams,
      editor = me.activeEditor,
      column;

    if(editor){
      column = o.column;
      value = editor.get();

      if(s.proxyType === 'server' && column.type !== 'combo'){
        key = me.getActiveColumnKey();
        value = me.prepareValue(value);

        s.set(o.rowIndex, key, value);
      }

      editor.hide();
      editor.hideErrorTip();
    }

    delete me.activeEditor;
  },
  /*
   * @param {Fancy.Element} cell
   * @return {Object}
   */
  getCellPosition: function(cell){
    var me = this,
      w = me.widget,
      gridBorders = w.gridBorders,
      cellEl = Fancy.get(cell),
      cellOffset = cellEl.offset(),
      gridOffset = w.el.offset(),
      offset = {
        left: parseInt(cellOffset.left) - parseInt(gridOffset.left) - 2 + 'px',
        top: parseInt(cellOffset.top) - parseInt(gridOffset.top) - (gridBorders[0] + gridBorders[2]) + 'px'
      };

    return offset;
  },
  /*
   * @param {Fancy.Element} cell
   * @return {Object}
   */
  getCellSize: function(cell){
    var me = this,
      w = me.widget,
      cellEl = Fancy.get(cell),
      width = cellEl.width(),
      height = cellEl.height(),
      coeficient = 2;

    if(Fancy.nojQuery && w.panelBorderWidth === 2){
      coeficient = 1;
    }

    width += parseInt( cellEl.css('border-right-width') ) * coeficient;
    height += parseInt( cellEl.css('border-bottom-width') ) * coeficient;

    return {
      width: width,
      height: height
    };
  },
  /*
   * @param {Object} o
   */
  setEditorValue: function(o){
    var me = this,
      w = me.widget,
      lang = w.lang,
      editor = me.activeEditor;

    switch(o.column.type){
      case 'combo':
        if(editor.valueIndex !== - 1){
          editor.set(editor.getValueKey(o.value), false);
        }
        break;
      case 'date':
        var format = o.column.format,
          date = Fancy.Date.parse(o.value, format.read, format.mode);

        editor.set(date);
        break;
      default:
        editor.set(o.value);
    }
  },
  /*
   * @param {Object} editor
   * @param {String} value
   */
  onEditorEnter: function(editor, value){
    var me = this;

    me.hideEditor();
  },
  /*
   *
   */
  onHeaderCellMouseDown: function(){
    var me = this;

    me.hideEditor();
  },
  /*
   * @param {Object} editor
   * @param {String} value
   */
  onKey: function(editor, value){
    var me = this;

  },
  /*
   * @param {String} value
   */
  setValue: function(value){
    var me = this,
      w = me.widget,
      s = w.store,
      key,
      o = me.activeCellEditParams,
      editor = me.activeEditor;

    if(editor === undefined){
      return;
    }

    if(editor.isValid() === false){
      return;
    }

    if(s.proxyType === 'server'){
      return;
    }

    key = me.getActiveColumnKey();
    value = me.prepareValue(value);

    if(editor.type === 'field.date' && editor.isEqual(s.get(o.rowIndex, key))){
      return;
    }

    s.set(o.rowIndex, key, value);
  },
  /*
   * @param {Object} editor
   */
  onEditorBeforeHide: function(editor){
    var me = this;

    me.setValue(editor.getValue());
  },
  /*
   *
   */
  onScroll: function(){
    var me = this;

    me.hideEditor();
  },
  /*
   * @param {Object} field
   */
  onBlur: function(field){
    var me = this;

    if(!me.activeEditor || field.id === me.activeEditor.id) {
      if(field.mouseDownSpinUp === true || field.mouseDownSpinDown){
        return;
      }

      me.hideEditor();
    }
  },
  /*
   * @param {*} value
   * @return {*}
   */
  prepareValue: function(value){
    var me = this,
      type = me.getActiveColumnType(),
      o = me.activeCellEditParams,
      column = o.column;

    switch(type){
      case 'number':
      case 'currency':
        if( value !== ''){
          value = Number(value);
        }
        break;
      case 'date':
        if(column.format && column.format.read){
          var date = column.editor.getDate();
          value = Fancy.Date.format(date, column.format.read, undefined, column.format.mode);
        }
        break;
    }

    return value;
  },
  /*
   * @return {String}
   */
  getActiveColumnType: function(){
    var me = this,
      o = me.activeCellEditParams,
      column = o.column;

    return column.type;
  },
  /*
   * @return {String}
   */
  getActiveColumnKey: function(){
    var me = this,
      o = me.activeCellEditParams,
      column = o.column,
      key = column.key ||column.index;

    return key;
  },
  /*
   * @param {Object} o
   */
  onCheckBoxChange: function(o){
    var me = this,
      w = me.widget,
      column = o.column,
      key = column.key ||column.index,
      s = w.store,
      value = me.checkBoxChangedValue;

    if(me.activeEditor){
      me.hideEditor();
    }

    if(me.checkBoxChangedValue === undefined){
      return
    }

    delete me.checkBoxChangedValue;

    me.activeCellEditParams = o;
    w.edit.activeCellEditParams = o;

    s.set(o.rowIndex, key, value);
  },
  /*
   * @param {Object} combo
   * @param {*} value
   */
  onComboChange: function(combo, value){
    var me = this,
      w = me.widget,
      s = w.store,
      editor = me.activeEditor,
      o = me.activeCellEditParams,
      key = me.getActiveColumnKey(),
      newValue = editor.getDisplayValue(value);

    if(combo.valueIndex !== -1){
      value = newValue;
    }

    s.set(o.rowIndex, key, value);
    me.hideEditor();
  }
});/*
 * @class Fancy.grid.plugin.RowEdit
 */
Fancy.define('Fancy.grid.plugin.RowEdit', {
  extend: Fancy.Plugin,
  ptype: 'grid.rowedit',
  inWidgetName: 'rowedit',
  rendered: false,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this;

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.Super('init', arguments);

    me.ons();
  },
  /*
   *
   */
  ons: function(){
    var me = this,
      w = me.widget,
      store = w.store;

    w.on('scroll', me.onScroll, me);
    w.on('columnresize', me.onColumnResize, me);

    if(w.grouping){
      w.on('collapse', me.onCollapse, me);
      w.on('expand', me.onExpand, me);
    }
  },
  /*
   *
   */
  onCollapse: function(){
    var me = this;

    me.hide();
  },
  /*
   *
   */
  onExpand: function(){
    var me = this;

    me.hide();
  },
  /*
   * @param {Object} o
   */
  edit: function(o){
    var me = this,
      w = me.widget,
      store = w.store,
      column = o.column,
      columnType = column.type;

    if(column.index === '$selected'){
      return;
    }

    w.scroller.scrollToCell(o.cell);
    me.showEditor(o);
  },
  /*
   * @param {Object} o
   */
  showEditor: function(o){
    var me = this;

    me.changed = {};

    if(!me.rendered){
      me.render();
      me.changePosition(o.rowIndex, false);
    }
    else{
      var isHidden = me.el.css('display') === 'none';
      me.show();
      me.changePosition(o.rowIndex, !isHidden);
    }

    me.setValues(o);

    me.setSizes();
  },
  /*
   *
   */
  render: function(){
    var me = this,
      w = me.widget;

    if(w.leftColumns){
      me.leftEl = me.renderTo(w.leftBody.el, w.leftColumns);
    }

    if(w.columns){
      me.el = me.renderTo(w.body.el, w.columns);
    }

    if(w.rightColumns){
      me.rightEl = me.renderTo(w.rightBody.el, w.rightColumns);
    }

    me.renderButtons();

    me.rendered = true;
  },
  /*
   * @param {Object} renderTo
   * @param {Array} columns
   * @return {Fancy.Element}
   */
  renderTo: function(renderTo, columns){
    var me = this,
      w = me.widget,
      container = Fancy.get(document.createElement('div')),
      el,
      i = 0,
      iL = columns.length,
      theme = w.theme,
      column,
      style = {
        'float': 'left',
        //'margin-top': '2px',
        //'margin-left': '2px',
        margin: '0px',
        padding: '0px'
      };

    container.addClass(w.rowEditCls);

    el = Fancy.get(renderTo.dom.appendChild(container.dom));

    for(;i<iL;i++){
      column = columns[i];
      var columnWidth = column.width;

      var itemConfig = {
        index: column.index,
        renderTo: el.dom,
        label: false,
        style: style,
        width: columnWidth,
        vtype: column.vtype,
        format: column.format,
        stopPropagation: true,
        theme: theme,
        events: [{
          change: me.onFieldChange,
          scope: me
        },{
          enter: me.onFieldEnter,
          scope: me
        }]
      };

      var editor;

      if(column.editable === false){
        Fancy.apply(itemConfig, {

        });

        switch(column.type){
          case 'string':
          case 'number':
            editor = new Fancy.TextField(itemConfig);
            break;
          default:
            editor = new Fancy.EmptyField(itemConfig);
        }
      }
      else{
        switch(column.type){
          case 'image':
          case 'string':
          case 'color':
            Fancy.apply(itemConfig, {

            });

            editor = new Fancy.StringField(itemConfig);
            break;
          case 'number':
            Fancy.apply(itemConfig, {

            });

            if(column.spin){
              itemConfig.spin = column.spin;
            }

            if(column.step){
              itemConfig.step = column.step;
            }

            if(column.min){
              itemConfig.min = column.min;
            }

            if(column.max){
              itemConfig.max = column.max;
            }

            editor = new Fancy.NumberField(itemConfig);
            break;
          case 'combo':
            Fancy.apply(itemConfig, {
              data: me.configComboData(column.data),
              displayKey: 'valueText',
              valueKey: 'index',
              value: 0,
              padding: false
            });

            editor = new Fancy.Combo(itemConfig);
            break;
          case 'checkbox':
            var paddingLeft;
            switch(column.cellAlign){
              case 'left':
                paddingLeft = 7;
                break;
              case 'center':
                paddingLeft = (column.width - 20 - 2)/2;
                break;
              case 'right':
                paddingLeft = (column.width - 20)/2 + 11;
                break;
            }

            Fancy.apply(itemConfig, {
              renderId: true,
              value: false,
              style: {
                padding: '0px',
                display: 'inline-block',
                'padding-left': paddingLeft,
                'float': 'left',
                margin: '0px'
              }
            });

            editor = new Fancy.CheckBox(itemConfig);
            break;
          default:
            editor = new Fancy.EmptyField(itemConfig);
        }
      }
      column.rowEditor = editor;
    }

    return el;
  },
  /*
   *
   */
  renderButtons: function(){
    var me = this,
      w = me.widget,
      container = Fancy.get(document.createElement('div')),
      el;

    container.addClass(w.rowEditButtonCls);

    el = Fancy.get(w.body.el.dom.appendChild(container.dom));

    me.buttonsEl = el;

    me.buttonUpdate = new Fancy.Button({
      cls: 'fancy-edit-row-button-update',
      renderTo: el.dom,
      text: 'Update',
      events: [{
        click: me.onClickUpdate,
        scope: me
      }]
    });

    me.buttonCancel = new Fancy.Button({
      cls: 'fancy-edit-row-button-cancel',
      renderTo: el.dom,
      text: 'Cancel',
      events: [{
        click: me.onClickCancel,
        scope: me
      }]
    });
  },
  /*
   *
   */
  setSizes: function(){
    var me = this,
      w = me.widget;

    if(w.leftColumns){
      me._setSizes(w.leftBody.el.select('.fancy-grid-cell[index="0"]'), w.leftColumns, 'left');
    }

    if(w.columns){
      me._setSizes(w.body.el.select('.fancy-grid-cell[index="0"]'), w.columns);
    }

    if(w.rightColumns){
      me._setSizes(w.rightBody.el.select('.fancy-grid-cell[index="0"]'), w.rightColumns, 'right');
    }

    me.setElSize();
  },
  /*
   *
   */
  setElSize: function(){
    var me = this,
      w = me.widget,
      centerWidth = w.getCenterViewWidth(),
      centerFullWidth = w.getCenterFullWidth();

    if(centerWidth < centerFullWidth){
      me.el.css('width', centerFullWidth);
    }
  },
  /*
   * @param {Fancy.Elements} firstRowCells
   * @param {Array} columns
   * @param {String} side
   */
  _setSizes: function(firstRowCells, columns, side){
    var me = this,
      i = 0,
      iL = columns.length,
      column,
      cellSize,
      cell,
      cellEl,
      editor,
      borderWidth = 1,
      offset = 2;

    for(;i<iL;i++){
      column = columns[i];
      cell = firstRowCells.item(i).dom;
      cellEl = Fancy.get(cell);
      cellSize = me.getCellSize(cell);
      editor = column.rowEditor;

      if(!editor){
        continue;
      }

      if((side === 'left' || side === 'right') && i === iL - 1){
        cellSize.width--;
      }

      cellSize.height -= 2;

      if(i === iL - 1){
        editor.el.css('width', (cellSize.width - 2));
      }
      else{
        editor.el.css('width', (cellSize.width - 1));
      }

      editor.el.css('height', (cellSize.height));

      cellSize.width -= borderWidth * 2;
      cellSize.width -= offset * 2;

      //cellSize.height -= borderWidth * 2;
      cellSize.height -= offset * 2;

      me.setEditorSize(editor, cellSize);
    }
  },
  //Dublication code from Fancy.grid.plugin.CellEdit
  /*
   * @param {Fancy.Element} cell
   * @return {Object}
   */
  getCellSize: function(cell){
    var me = this,
      w = me.widget,
      cellEl = Fancy.get(cell),
      width = cellEl.width(),
      height = cellEl.height(),
      coeficient = 2;

    if(Fancy.nojQuery && w.panelBorderWidth === 2){
      coeficient = 1;
    }

    width += parseInt( cellEl.css('border-right-width') ) * coeficient;
    height += parseInt( cellEl.css('border-bottom-width') ) * coeficient;

    return {
      width: width,
      height: height
    };
  },
  /*
   * @param {Object} editor
   * @param {Number} size
   */
  setEditorSize: function(editor, size){
    var me = this;

    if(editor.wtype === 'field.combo'){
      editor.size(size);

      editor.el.css('width', size.width + 5);
    }
    else{
      editor.setInputSize({
        width: size.width,
        height: size.height
      });
    }
  },
  /*
   * @param {Number} rowIndex
   * @param {Boolean} animate
   */
  changePosition: function(rowIndex, animate){
    var me = this,
      w = me.widget,
      scrollTop = w.scroller.getScroll(),
      bottomScroll = w.scroller.getBottomScroll(),
      newTop = w.cellHeight * rowIndex - 1 - scrollTop,
      duration = 100,
      plusTop = 0;

    if(w.grouping){
      plusTop += w.grouping.getOffsetForRow(rowIndex);
      newTop += plusTop;
    }

    if(me.leftEl){
      if(animate !== false){
        me.leftEl.animate({
          duration: duration,
          top: newTop
        });
      }
      else {
        me.leftEl.css('top', newTop);
      }
    }

    if(me.el){
      if(animate !== false){
        me.el.animate({
          duration: duration,
          top: newTop
        });
      }
      else{
        me.el.css('top', newTop);
      }
    }

    if(me.rightEl){
      if(animate !== false){
        me.rightEl.animate({
          duration: duration,
          top: newTop
        });
      }
      else{
        me.rightEl.css('top', newTop);
      }
    }

    var showOnTop = w.getViewTotal() - 3 < rowIndex,
      buttonTop = newTop;

    if(showOnTop){
      if(w.grouping){
        if(w.getViewTotal() - 3 < rowIndex - w.grouping.getSpecialRowsUnder(rowIndex)){
          buttonTop = newTop - parseInt(me.buttonsEl.css('height')) + 1;
        }
        else{
          buttonTop = newTop + w.cellHeight;
          showOnTop = false;
        }
      }
      else{
        buttonTop = newTop - parseInt(me.buttonsEl.css('height')) + 1;
      }
    }
    else{
      buttonTop = newTop + w.cellHeight;
    }

    if(animate !== false) {
      me.buttonsEl.animate({
        duration: duration,
        top: buttonTop
      });
    }
    else{
      me.buttonsEl.css('top', buttonTop);
    }

    me.el.css('left', -bottomScroll);

    me.changeButtonsLeftPos();

    me.activeRowIndex = rowIndex;
  },
  /*
   *
   */
  changeButtonsLeftPos: function(){
    var me = this,
      w = me.widget,
      viewWidth = w.getCenterViewWidth(),
      buttonsElWidth = parseInt(me.buttonsEl.css('width'));

    me.buttonsEl.css('left', (viewWidth - buttonsElWidth)/2);
  },
  /*
   * @param {Object} o
   */
  setValues: function(o){
    var me = this,
      w = me.widget;

    if(w.leftColumns){
      me._setValues(o.data, w.leftColumns);
    }

    if(w.columns){
      me._setValues(o.data, w.columns);
    }

    if(w.rightColumns){
      me._setValues(o.data, w.rightColumns);
    }

    me.activeId = o.id;
  },
  /*
   * @param {Array} data
   * @param {Array} columns
   */
  _setValues: function(data, columns){
    var me = this,
      i = 0,
      iL = columns.length,
      column,
      editor;

    for(;i<iL;i++){
      column = columns[i];
      editor = column.rowEditor;
      if(editor){
        switch(column.type){
          case 'action':
          case 'button':
            break;
          default:
            editor.set(data[column.index], false);
        }
      }
    }
  },
  /*
   *
   */
  onScroll: function(){
    var me = this,
      w = me.widget;

    if(me.rendered === false){
      return;
    }

    if(me.activeRowIndex !== undefined){
      me.changePosition(me.activeRowIndex, false);
    }
  },
  /*
   *
   */
  onColumnResize: function(){
    var me = this,
      w = me.widget;

    if(me.rendered === false){
      return;
    }

    me.setSizes();
  },
  /*
   *
   */
  onClickUpdate: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    var rowIndex = s.getRow(me.activeId);
    s.setItemData(rowIndex, me.changed);
    w.update();

    me.hide();
  },
  /*
   *
   */
  onClickCancel: function(){
    var me = this;

    me.hide();
  },
  /*
   *
   */
  hide: function(){
    var me = this;

    if(!me.el){
      return;
    }

    if(me.leftEl){
      me.leftEl.hide();
    }

    me.el.hide();

    if(me.rightEl){
      me.rightEl.hide();
    }

    me.buttonsEl.hide();
  },
  /*
   *
   */
  show: function(){
    var me = this;

    if(me.leftEl){
      me.leftEl.show();
    }

    me.el.show();

    if(me.rightEl){
      me.rightEl.show();
    }

    me.buttonsEl.show();
  },
  /*
   * @param {Object} field
   * @param {*} newValue
   * @param {*} oldValue
   */
  onFieldChange: function(field, newValue, oldValue){
    var me = this;

    me.changed[field.index] = newValue;
  },
  //Duplication code from Fancy.grid.plugin.CellEdit
  /*
   * @param {Array} data
   * @return {Array}
   */
  configComboData: function(data){
    var i = 0,
      iL = data.length,
      _data = [];

    if(Fancy.isObject(data)){
      return data;
    }

    for(;i<iL;i++){
      _data.push({
        //index: i,
        index: data[i],
        valueText: data[i]
      });
    }

    return _data;
  },
  /*
   *
   */
  onFieldEnter: function(){
    var me = this,
      w = me.widget,
      s = w.store;

    var rowIndex = s.getRow(me.activeId);
    s.setItemData(rowIndex, me.changed);
    w.update();

    me.hide();
  }
});