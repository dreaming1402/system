/*
 * @mixin Fancy.store.mixin.Paging
 */
Fancy.Mixin('Fancy.store.mixin.Paging',{
  /*
   *
   */
  initPaging: function(){
    var me = this;

    if(me.paging === undefined){
      return;
    }

    if(Fancy.isObject(me.paging)){
      Fancy.apply(me, me.paging);
    }

    me.calcPages();
    me.changeDataView();
  },
  /*
   *
   */
  firstPage: function(){
    var me = this;

    me.calcPages();

    me.showPage = 0;

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  prevPage: function(){
    var me = this;

    me.calcPages();
    me.showPage--;

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  nextPage: function(){
    var me = this;

    me.calcPages();
    me.showPage++;

    if(me.showPage === me.pages){
      me.showPage--;
    }

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  lastPage: function(){
    var me = this;

    me.calcPages();
    me.showPage = me.pages - 1;

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  },
  /*
   *
   */
  calcPages: function(){
    var me = this;

    if(me.pageType === 'server'){
      var oldPages = me.pages;
      me.pages = Math.ceil(me.getTotal() / me.pageSize);
      if(!isNaN(oldPages) && oldPages > me.pages){
        me.showPage--;
        if(me.showPage < 0){
          me.showPage = 0;
        }
        return 'needs reload';
      }
    }
    else {
      me.pages = Math.ceil(me.getTotal() / me.pageSize);
    }

    if(me.showPage >= me.pages){
      me.showPage = me.pages - 1;
    }

    if(me.showPage < 0){
      me.showPage = 0;
    }

    me.fire('changepages');
  },
  /*
   * @param {Number} value
   */
  setPage: function(value){
    var me = this;

    me.showPage = value;

    if(me.showPage === me.pages){
      me.showPage--;
    }

    if(me.showPage < 0){
      me.showPage = 0;
    }

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else{
      me.changeDataView();
    }
  },
  /*
   * @param {Object} o
   */
  processPagingData: function(o){
    var me = this;

    me.checkPagingType(o);
    me.setData(o[me.readerRootProperty]);
    me.changeDataView();
    if( me.calcPages() === 'needs reload' ){
      me.loadPage();
    }
  },
  /*
   * @param {Object} o
   */
  checkPagingType: function(o){
    var me = this;

    if(o.totalCount !== undefined && o.totalCount !== o[me.readerRootProperty].length){
      me.totalCount = o.totalCount;
      me.pageType = 'server';
      if(me.remoteSort === undefined) {
        me.remoteSort = true;
      }
      //Not sure what is better about type of paging, sorting, filtering
      //maybe just actionType
      //me.actionType = 'server';
    }
  },
  /*
   *
   */
  loadPage: function(){
    var me = this;

    me.loadData();
  },
  /*
   * @param {Number} value
   */
  setPageSize: function(value){
    var me = this;

    me.pageSize = value;

    me.calcPages();

    if(me.pageType === 'server'){
      me.loadPage();
    }
    else {
      me.changeDataView();
    }
  }
});/*
 * @class Fancy.grid.plugin.Paging
 * @extends Fancy.Plugin
 */
Fancy.define('Fancy.grid.plugin.Paging', {
  extend: Fancy.Plugin,
  ptype: 'grid.paging',
  inWidgetName: 'paging',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config) {
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

    store.on('change', me.onChangeStore, me);
    store.on('remove', me.onChangeStore, me);
    store.on('filter', me.onChangeStore, me);
    w.on('render', me.onRenderGrid, me);
  },
  /*
   * @param {Number} value
   */
  setPageSize: function(value){
    var me = this,
      w = me.widget,
      store = w.store;

    store.setPageSize(value);
  },
  /*
   *
   */
  nextPage: function(){
    var me = this,
      w = me.widget,
      store = w.store;

    store.nextPage();
  },
  /*
   *
   */
  lastPage: function(){
    var me = this,
      w = me.widget,
      store = w.store;

    store.lastPage();
  },
  /*
   *
   */
  prevPage: function(){
    var me = this,
      w = me.widget,
      store = w.store;

    store.prevPage();
  },
  /*
   *
   */
  firstPage: function(){
    var me = this,
      w = me.widget,
      store = w.store;

    store.firstPage();
  },
  /*
   * @param {Fancy.Store} store
   */
  onChangeStore: function(store){
    var me = this,
      w = me.widget,
      s = w.store,
      panel = w.panel,
      pageField = panel._bbar.roles.pagenumber;

    pageField.setValue(s.showPage + 1);
    me.updateBar();
    w.setSidesHeight();
    w.fire('changepage');
  },
  /*
   * @param {Number} value
   */
  setPage: function(value){
    var me = this,
      w = me.widget,
      s = w.store;

    s.setPage(value);
  },
  /*
   *
   */
  updateBar: function(){
    var me = this,
      w = me.widget,
      s = w.store,
      showPage = s.showPage,
      pageSize = s.pageSize,
      pages = s.pages,
      panel = w.panel,
      bbarRoles = panel._bbar.roles,
      pageField = bbarRoles.pagenumber,
      ofText = bbarRoles.ofText,
      info = bbarRoles.info,
      first = bbarRoles.first,
      prev = bbarRoles.prev,
      next = bbarRoles.next,
      last = bbarRoles.last,
      infoStart = showPage * pageSize + 1,
      infoEnd = infoStart + pageSize,
      infoTotal = s.getTotal() || 0,
      lang = w.lang;

    if(infoEnd > infoTotal){
      infoEnd = infoTotal;
    }

    if(infoEnd === 0){
      infoStart = 0;
    }

    pageField.setValue(s.showPage + 1);

    ofText.el.update( Fancy.String.format(lang.paging.of, [pages || 1]) );
    info.el.update( Fancy.String.format(lang.paging.info, [infoStart, infoEnd, infoTotal]) );

    if(showPage === 0){
      first.disable();
      prev.disable();
    }
    else{
      first.enable();
      prev.enable();
    }

    if(pages - 1 === showPage || pages === 0){
      last.disable();
      next.disable();
    }
    else{
      last.enable();
      next.enable();
    }
  },
  /*
   *
   */
  onRenderGrid: function(){
    var me = this;

    me.updateBar();
  }
});