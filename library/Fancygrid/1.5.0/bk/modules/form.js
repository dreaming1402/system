/**
 * @class Fancy.toolbar.Tab
 * @extends Fancy.Button
 */
Fancy.define('Fancy.toolbar.Tab', {
  extend: Fancy.Button,
  /*
   * @constructor
   * @param config
   * @param scope
   */
  constructor: function(config, scope){
    var me = this;

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;
  
    me.Super('init', arguments);
  },
  cls: 'fancy fancy-button fancy-toolbar-tab',
  /*
   *
   */
  render: function(){
    var me = this;

    me.Super('render', arguments);
  }
});Fancy.Mixin('Fancy.form.mixin.Form', {
  init: function(){
    var me = this;

    me.calcFieldSize();
    me.Super('init', arguments);

    me.addEvents('init', 'set');
    
    if(Fancy.fullBuilt !== true && Fancy.MODULELOAD !== false && me.fullBuilt !== true && me.neededModules !== true){
      me.loadModules();
      return;
    }

    me.fire('beforerender');

    me.applyDefaults();
    me.preRender();
    me.render();
    me.ons();
    me.fire('init');
  },
  cls: '',
  widgetCls: 'fancy fancy-form',
  value: '',
  width: 200,
  height: 300,
  emptyText: '',
  tpl: [
    '<div class="fancy-form-body">',
    '</div>'
  ],
  preRender: function(){
    var me = this;

    me.initRenderTo();

    if( me.title || me.tbar || me.bbar || me.buttons ){
      me.renderPanel();
    }
  },
  renderPanel: function(){
    var me = this,
      panelConfig = {
        renderTo: me.renderTo,
        title: me.title,
        subTitle: me.subTitle,
        subTitleHeight: me.subTitleHeight,
        width: me.width,
        height: me.height,
        titleHeight: me.titleHeight,
        barHeight: me.barHeight,
        theme: me.theme,
        shadow: me.shadow,
        style: me.style || {},
        window: me.window,
        modal: me.modal,
        frame: me.frame,
        items: [me],
        tabs: me.tabs,
        draggable: me.draggable,
        minWidth: me.minWidth,
        minHeight: me.minHeight,
        panelBodyBorders: me.panelBodyBorders,
        resizable: me.resizable
      };

    if(me.tabs){
      panelConfig.tbar = me.generateTabs();
    }

    if(me.bbar){
      panelConfig.bbar = me.bbar;
      me.height -= me.barHeight;
    }

    if(me.tbar){
      panelConfig.tbar = me.tbar;
      me.height -= me.barHeight;
    }

    if(me.buttons){
      panelConfig.buttons = me.buttons;
      me.height -= me.barHeight;
      panelConfig.buttons = me.buttons;
    }

    if(me.footer){
      panelConfig.footer = me.footer;
      me.height -= me.barHeight;
    }

    me.panel = new Fancy.Panel(panelConfig);

    me.bbar = me.panel.bbar;
    me.tbar = me.panel.tbar;
    me.buttons = me.panel.buttons;

    me.panel.el.addClass('fancy-panel-grid-inside');

    if(me.title) {
      me.height -= me.titleHeight;
    }

    if(me.subTitle) {
      me.height -= me.subTitleHeight;
      me.height += me.panelBodyBorders[2];
    }

    me.height -= me.panelBorderWidth;

    me.renderTo = me.panel.el.select('.fancy-panel-body-inner').dom;
  },
  initRenderTo: function(){
    var me = this,
      renderTo = me.renderTo || document.body;

    if(Fancy.isString(renderTo)){
      renderTo = document.getElementById(renderTo);
      if(!renderTo){
        renderTo = Fancy.select(renderTo).item(0);
      }
    }

    me.renderTo = renderTo;
  },
  render: function(){
    var me = this,
      renderTo = me.renderTo,
      el = Fancy.get( document.createElement('div') );

    el.addClass(me.cls);
    el.addClass(me.widgetCls);
    el.attr('id', me.id);

    el.css({
      width: me.width + 'px',
      height: me.height + 'px'
    });

    el.update(me.tpl.join(' '));

    me.el = Fancy.get(Fancy.get(renderTo).dom.appendChild(el.dom));

    if(me.panel === undefined){
      if(me.shadow){
        el.addClass('fancy-panel-shadow');
      }

      if( me.theme !== 'default' ){
        el.addClass('fancy-theme-' + me.theme);
      }
    }

    me._items = [];
    me.renderItems();
    me.items = me._items;
    delete me._items;

    if(me.tabs || me.tabbed) {
      me.setActiveTab();
    }

    me.fire('afterrender');
    me.fire('render');
  },
  generateTabs: function(){
    var me = this,
      tbar = [];

    if(me.tabs){
      var i = 0,
        iL = me.tabs.length;

      for(;i<iL;i++){
        var tabConfig = {
          type: 'tab'
        };

        if( Fancy.isString(me.tabs[i]) ){
          tabConfig.text = me.tabs[i];
        }
        else{
          tabConfig = me.tabs[i];
        }

        me.tabs[i] = tabConfig;

        if( me.tabs[i].handler === undefined ){
          me.tabs[i].handler = (function(i){
            return function(){
              me.setActiveTab(i);
            }
          })(i);
        }

        tbar.push(me.tabs[i]);
      }
    }

    return tbar;
  },
  setActiveTab: function(newActiveTab){
    var me = this,
      tabs = me.el.select('.fancy-field-tab'),
      oldActiveTab = me.el.select('.fancy-field-tab-active');

    if( newActiveTab !== undefined ){
      me.activeTab = newActiveTab;
    }

    if( me.activeTab === undefined ){
      me.activeTab = 0;
    }

    oldActiveTab.removeClass('fancy-field-tab-active');
    tabs.item(me.activeTab).addClass('fancy-field-tab-active');

    if(me.tabs){
      var toolbarTabs = me.panel.el.select('.fancy-panel-tbar .fancy-toolbar-tab');
      toolbarTabs.removeClass('fancy-toolbar-tab-active');
      toolbarTabs.item(me.activeTab).addClass('fancy-toolbar-tab-active');
    }
  },
  renderItems: function(renderTo, items){
    var me = this,
      i = 0,
      iL,
      subItems = [],
      j,
      jL;

    items = items || me.items;
    iL = items.length;
    renderTo = renderTo || me.el.getByClass('fancy-form-body');

    for(;i<iL;i++){
      var item = items[i],
        field;

      item.theme = me.theme;

      switch(item.type){
        case 'pass':
        case 'password':
          field = Fancy.form.field.String;
          item.type = 'string';
          item.isPassword = true;
          break;
        case 'hidden':
          field = Fancy.form.field.String;
          item.hidden = true;
          break;
        case 'line':
        case 'row':
          field = Fancy.form.field.Line;
          item = me.applyDefaults(item);
          break;
        case 'set':
        case 'fieldset':
          item.form = me;
          field = Fancy.form.field.Set;
          item = me.applyDefaults(item);
          break;
        case 'tab':
          field = Fancy.form.field.Tab;
          item = me.applyDefaults(item);
          break;
        case 'string':
          field = Fancy.form.field.String;
          break;
        case 'number':
          field = Fancy.form.field.Number;
          break;
        case 'textarea':
          field = Fancy.form.field.TextArea;
          break;
        case 'checkbox':
          field = Fancy.form.field.CheckBox;
          break;
        case 'switcher':
          field = Fancy.form.field.Switcher;
          break;
        case 'combo':
          field = Fancy.form.field.Combo;
          break;
        case 'html':
          field = Fancy.form.field.HTML;
          break;
        case 'radio':
          field = Fancy.form.field.Radio;
          break;
        case 'date':
          field = Fancy.form.field.Date;
          break;
        case 'recaptcha':
          field = Fancy.form.field.ReCaptcha;
          break;
        case 'button':
          field = Fancy.form.field.Button;
          break;
        case 'segbutton':
          field = Fancy.form.field.SegButton;
          break;
        default:
          throw new Error('type ' + item.type + ' is not set');
      }

      item.renderTo = item.renderTo || renderTo;

      var _item = new field(item);

      switch(item.type){
        case 'line':
        case 'row':
        case 'set':
        case 'fieldset':
        case 'tab':
          me.renderItems(_item.el.select('.fancy-field-text').dom, _item.items);
          break;
        default:
          me._items.push(_item);
      }
    }
  },
  applyDefaults: function(item) {
    var me = this;

    if(item === undefined){
      var items = me.items,
          i = 0,
          iL = items.length,
          defaults = me.defaults || {};

      for(;i<iL;i++){
        Fancy.applyIf(items[i], defaults);
      }

      return;
    }

    var j,
      jL;

    if (item.defaults) {
      j = 0;
      jL = item.items.length;

      for (; j < jL; j++) {
        Fancy.applyIf(item.items[j], item.defaults);
      }
    }

    return item;
  },
  ons: function(){
    var me = this;

    Fancy.each(me.items, function(item){
      switch(item.type){
        case 'line':
        case 'row':
          break;
        case 'set':
        case 'fieldset':
          break;
        case 'tab':
        case 'button':
        case 'segbutton':
          break;
        default:
          item.on('change', me.onChange, me);
      }
    });
  },
  onChange: function(field, value, oldValue){
    var me = this;

    me.fire('set', {
      name: field.name,
      value: value,
      oldValue: oldValue
    });
  },
  get: function(name){
    var me = this;

    if( name ){
      var value;
      Fancy.each(me.items, function(item){
        switch(item.type){
          case 'html':
          case 'button':
            return;
            break;
        }

        if( item.name === name ){
          value = item.get();
          return true;
        }
      });
      return value;
    }
    else{
      var values = {};

      Fancy.each(me.items, function(item){
        switch(item.type){
          case 'html':
          case 'button':
            return;
            break;
        }

        values[item.name] = item.get();
      });

      return values;
    }
  },
  set: function(name, value){
    var me = this;

    if(Fancy.isObject(name)){
      for(var p in name){
        me.set(p, name[p]);
      }
      return;
    }

    if( name ){
      Fancy.each(me.items, function(item){
        if( item.name !== name ){
          return;
        }
        
        item.set(value);
      });
      return value;
    }
  },
  clear: function(clear){
    var me = this;

    Fancy.each(me.items, function(item){
      switch(item.type){
        case 'html':
        case 'recaptcha':
        case 'button':
          return;
          break;
      }

      if( clear !== false ){
        item.clear();
      }

      var el = item.el;
      if( el.hasClass('fancy-field-not-valid') ){
        el.removeClass('fancy-field-not-valid');
        el.css('height', ( parseInt( el.css('height') ) - 6) + 'px');
      }
      if( el.hasClass('fancy-field-blank-err') ){
        el.removeClass('fancy-field-blank-err');
        el.css('height', ( parseInt( el.css('height') ) - 6) + 'px');
      }

      if( item.name && me.params && me.params[item.name] ){
        delete me.params[item.name];
      }
    });
  },
  submit: function(o){
    var me = this,
      o = o || {},
      params = me.params || {};

    me.params = me.params || {};

    Fancy.apply(me, o);

    if( o.params ){
      Fancy.apply(params, me.params);
      me.params = params;
    }

    me.clear(false);
    if( me.valid() === false ){
      return;
    }

    var values = me.get();

    Fancy.apply(me.params, values);

    if(me.params.recaptcha === 'wait'){
      me.submit(o);
      return;
    }

    if( me.params.recaptcha === '' ){
      return;
    }

    me.params['g-recaptcha-response'] = me.params.recaptcha;
    delete me.params.recaptcha;

    Fancy.Ajax(me);
  },
  valid: function(){
    var me = this,
      valid = true;

    Fancy.each(me.items, function(item){
      if( valid === true ){

        valid = item.onBlur();
      }
      else{
        item.onBlur();
      }
    });

    return valid;
  },
  getItem: function(name){
    var me= this,
      item = false;

    Fancy.each(me.items, function(_item){
      if( _item.name === name ){
        item = _item;
        return true;
      }
    });

    return item;
  },
  showAt: function(){
    var me = this;

    if(me.panel){
      me.panel.showAt.apply(me.panel, arguments);
    }
  },
  show: function(){
    var me = this;

    if(me.panel){
      me.panel.show.apply(me.panel, arguments);
    }
    else{
      me.el.show();
    }
  },
  hide: function(){
    var me = this;

    if(me.panel){
      me.panel.el.css({
        display: 'none'
      });
    }
    else{
      me.el.css({
        display: 'none'
      });
    }

    var modal = Fancy.select('.fancy-modal');

    if(modal.dom){
      modal.css('display', 'none');
    }

    var i = 0,
        iL = me.items.length;

    for(;i<iL;i++){
      if(me.items[i].type === 'combo'){
        me.items[i].hideList();
      }
    }
  },
  setHeight: function(height){
    var me = this;

    if(me.panel){
      me.panel.el.css('height', height);

      if(me.buttons){
        height -= me.barHeight;
      }

      if(me.bbar){
        height -= me.barHeight;
      }

      if(me.tbar){
        height -= me.barHeight;
      }

      if(me.title){
        height -= me.titleHeight;
      }

      height -= me.panelBodyBorders[0];
      height -= me.panelBodyBorders[2];
    }

    me.el.css('height', height);
  },
  setWidth: function(){
    var me = this;


  },
  getHeight: function(){
    var me = this;

    if(me.panel){
      return me.panel.getHeight();
    }

    return parseInt(me.el.css('height'));
  },
  calcFieldSize: function(){
    var me = this,
      width = me.width,
      defaults = me.defaults || {},
      labelWidth = me.labelWidth,
      maxLabelNumber = me.maxLabelNumber;

    defaults.width = width - me.panelBorderWidth * 2;

    if(labelWidth === undefined){
      Fancy.each(me.items, function(item){
        switch(item.type){
          case 'set':
          case 'tab':
            if(item.type === 'tab'){
              me.tabbed = true;
            }

            var minusWidth = item.type === 'set'? 62:20;

            Fancy.each(item.items, function(_item){
              if(_item.width === undefined){
                _item.width = width - minusWidth;
              }

              if(_item.label && _item.label.length > maxLabelNumber){
                maxLabelNumber = _item.label.length;
              }
            });

            item.defaults = item.defaults || {};
            item.defaults.labelWidth = item.defaults.labelWidth || (maxLabelNumber + 1) * 8;
            break;
          case 'line':
            var numOfFields = item.items.length,
              isWidthInit = false,
              averageWidth = (width - 8 - 8 - 8)/numOfFields;

            Fancy.each(item.items, function(_item){
              if(_item.labelWidth || _item.inputWidth){
                isWidthInit = true;
              }
            });

            if(isWidthInit === false){
              Fancy.each(item.items, function(_item){
                _item.width = averageWidth;
                if(_item.labelAlign === 'top'){
                  _item.labelWidth = averageWidth;
                }
              });
            }

            item.defaults = item.defaults || {};
            break;
          default:
            if(item.label && item.label.length > maxLabelNumber){
              maxLabelNumber = item.label.length;
            }
        }
      });

      maxLabelNumber++;

      //labelWidth = defaults.width / 4.5;
      labelWidth = maxLabelNumber * 8;
      if(labelWidth < 50){
        labelWidth = 50;
      }
    }

    defaults.labelWidth = labelWidth;

    if(me.inputWidth){
      defaults.inputWidth = me.inputWidth;
    }

    me.defaults = defaults;
  },
  destroy: function() {
    var me = this;

    me.el.destroy();

    if(me.panel){
      me.panel.el.destroy();
    }
  },
  each: function(fn, scope){
    var me = this,
      items = me.items,
      i = 0,
      iL = items.length;

    if(scope){
      for(;i<iL;i++){
        fn.apply(this, [items[i]]);
      }
    }
    else{
      for(;i<iL;i++){
        fn(items[i]);
      }
    }
  },  
  loadModules: function(){
    var me = this,
      existedModules = Fancy.modules || {},
      requiredModules = {},
      fields = me.items || [];

    Fancy.modules = existedModules;

    if(Fancy.nojQuery){
      requiredModules.dom = true;
    }

    if(Fancy.isTouch){
      requiredModules.touch = true;
    }

    var i = 0,
      iL = fields.length;

    for(;i<iL;i++){
      var field = fields[i];
      if(field.type === 'date'){
        requiredModules.grid = true;
        requiredModules.selection = true;
        requiredModules.date = true;
      }

      if(field.items){
        var j = 0,
          jL = field.items.length;

        for(;j<jL;j++) {
          var _field = field.items[j];

          if(_field.type === 'date'){
            requiredModules.grid = true;
            requiredModules.selection = true;
            requiredModules.date = true;
          }
        }
      }
    }

    me.neededModules = {
      length: 0
    };

    for(var p in requiredModules){
      if(Fancy.modules[p] === undefined) {
        me.neededModules[p] = true;
        me.neededModules.length++;
      }
    }

    if(me.neededModules.length === 0){
      me.neededModules = true;
      me.init();
      return;
    }

    var onLoad = function(name){
      delete me.neededModules[name];
      me.neededModules.length--;

      if(me.neededModules.length === 0){
        me.neededModules = true;
        me.init();
      }
    };

    for(var p in me.neededModules){
      if(p === 'length'){
        continue;
      }

      Fancy.loadModule(p, onLoad);
    }
  },
  prevTab: function(){
    var me = this;

    me.activeTab--;
    if( me.activeTab < 0 ){
      me.activeTab = 0;
    }

    me.setActiveTab();
  },
  nextTab: function(){
    var me = this,
      tabNumber = me.el.select('.fancy-field-tab').length;

    me.activeTab++;

    if( me.activeTab >= tabNumber ){
      me.activeTab = tabNumber - 1;
    }

    me.setActiveTab();
  }
});/*
 * @mixin Fancy.form.mixin.PrepareConfig
 */
Fancy.Mixin('Fancy.form.mixin.PrepareConfig', {
  /*
   * @param {Object} config
   * @param {Object} originalConfig
   * @return {Object}
   */
  prepareConfig: function(config, originalConfig){
    var me = this;

    config = me.prepareConfigTheme(config, originalConfig);
    config = me.prepareConfigLang(config, originalConfig);
    config = me.prepareConfigDefaults(config);
    config = me.prepareConfigItems(config);
    config = me.prepareConfigFooter(config);

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigDefaults: function(config){
    if( config.defaults ){
      for(var p in config.defaults){
        Fancy.each(config.items, function(item){
          if( item[p] === undefined ){
            item[p] = config.defaults[p];
          }
        });
      }
    }

    return config;
  },
  /*
   * @param {Object} config
   * @return {Object}
   */
  prepareConfigItems: function(config){
    var me = this;

    Fancy.each(config.items, function(item){
      item.theme = me.theme || '';

      if( item.labelWidth === undefined ){
        item.labelWidth = me.labelWidth;
      }

      if( item.inputWidth === undefined ){
        item.inputWidth = me.inputWidth;
      }

      if( item.type === 'pass' || item.type === 'password' ){
        item.type = 'string';
        item.isPassword = true;
      }
    });

    return config;
  }
});/*
 * @class Fancy.FieldLine
 * @extend Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Line', 'Fancy.FieldLine'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.line',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    Fancy.apply(me, config);

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents();

    me.Super('init', arguments);

    var i = 0,
      iL = me.items.length,
      isItemTop;

    for(;i<iL;i++){
      var item = me.items[i];

      item.style = item.style || {};

      if( item.labelAlign === 'top' ){
        isItemTop = true;
      }
      else{
        item.style['padding-top'] = '0px'
      }

      if( i === 0 ){
        item.style['padding-left'] = '0px';
      }
    }

    me.preRender();
    me.render();

    if( isItemTop ){
      me.el.css('height', '48px');
    }
  },
  fieldCls: 'fancy fancy-field fancy-field-line',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-text fancy-field-line-items">',
    '</div>'
  ]
});/*
 * @class Fancy.SetField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Set', 'Fancy.SetField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.set',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    Fancy.apply(me, config);

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('beforecollapse', 'collapse', 'expanded');

    me.Super('init', arguments);

    var i = 0,
      iL = me.items.length,
      isItemTop;

    for(;i<iL;i++){
      var item = me.items[i];

      if( item.labelAlign === 'top' ){
        isItemTop = true;
        if( i === 0 ){
          item.style = {
            'padding-left': '0px'
          };
        }
      }
    }

    me.preRender();
    me.render();
    if( me.checkbox !== undefined ){
      me.initCheckBox();
    }

    me.on('beforecollapse', me.onBeforeCollapsed, me);
    me.on('expanded', me.onExpanded, me);
  },
  fieldCls: 'fancy fancy-field-set',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<fieldset>',
      '<legend>',
        '<div class="fancy-field-checkbox-input" style="float:left;margin-top: 4px;display: none;"></div>',
        '<div class="fancy-field-set-label" style="float:left;">{label}</div>',
        '<div class="fancy-clearfix"></div>',
      '</legend>',
      '<div class="fancy-field-text fancy-field-set-items">',

      '</div>',
    '</fieldset>'
  ],
  /*
   *
   */
  initCheckBox: function(){
    var me = this,
      checkbox = me.el.select('.fancy-field-checkbox-input');

    checkbox.css('display', '');

    if( me.checkbox === true ){
      me.el.addClass('fancy-checkbox-on');
    }

    var itemsEl = me.el.select('.fancy-field-set-items');

    setTimeout(function(){
      if( me.checkbox === true ){}
      else{
        me.fire('collapse');
      }
    }, 1);

    if( me.checkbox === true ){
      itemsEl.css('display', '');
      me.el.removeClass('fancy-set-collapsed');
    }
    else{
      itemsEl.css('display', 'none');
      me.el.addClass('fancy-set-collapsed');
    }

    checkbox.on('click', function(){
      me.el.toggleClass('fancy-checkbox-on');

      var isChecked = me.el.hasClass('fancy-checkbox-on'),
        itemsEl = me.el.select('.fancy-field-set-items');

      if( isChecked ){
        me.fire('beforeexpanded');
        itemsEl.css('display', '');
        me.el.removeClass('fancy-set-collapsed');
        me.fire('expanded');
      }
      else{
        me.fire('beforecollapse');
        itemsEl.css('display', 'none');
        me.el.addClass('fancy-set-collapsed');
        me.fire('collapse');
      }
    });
  },
  /*
   *
   */
  onBeforeCollapsed: function(){
    var me = this,
      form = me.form,
      itemsEl = me.el.select('.fancy-field-set-items'),
      itemsHeight = parseInt(itemsEl.css('height'));

    form.setHeight(form.getHeight() - itemsHeight);
  },
  /*
   *
   */
  onExpanded: function(){
    var me = this,
      form = me.form,
      itemsEl = me.el.select('.fancy-field-set-items'),
      itemsHeight = parseInt(itemsEl.css('height'));

    form.setHeight(form.getHeight() + itemsHeight);
  }
});/*
 * @class Fancy.Tab
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Tab', 'Fancy.Tab'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.tab',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    Fancy.apply(me, config);

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('collapsed', 'expanded');

    me.Super('init', arguments);

    var i = 0,
      iL = me.items.length,
      isItemTop;

    for(;i<iL;i++){
      var item = me.items[i];

      if( item.labelAlign === 'top' ){
        isItemTop = true;
        //break;
        if( i === 0 ){
          item.style = {
            'padding-left': '0px'
          };
        }
      }
    }

    me.preRender();
    me.render();
  },
  fieldCls: 'fancy fancy-field-tab',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-text fancy-field-tab-items">',
    '</div>'
  ]
});/*
 * @class Fancy.HTMLField
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.HTML', 'Fancy.HTMLField'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.html',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    Fancy.apply(me, config);

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('focus', 'blur', 'input', 'enter', 'up', 'down', 'change', 'key');

    me.Super('init', arguments);

    me.preRender();
    me.render();

    //me.ons();

    if( me.hidden ){
      me.el.css('display', 'none');
    }

    if( me.style ){
      me.el.css(me.style);
    }
  },
  fieldCls: 'fancy fancy-field-html',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="" style="">',
      '{value}',
    '</div>'
  ],
  /*
   *
   */
  render: function(){
    var me = this,
      renderTo = me.renderTo || document.body,
      el = document.createElement('div');

    //me.prepareValid();

    me.fire('beforerender');

    el.innerHTML = me.tpl.getHTML({
      value: me.value,
      height: me.height
    });

    me.el = renderTo.appendChild(el);
    me.el = Fancy.get(me.el);
    me.el.addClass( me.cls );
    me.el.addClass( me.fieldCls );

    me.acceptedValue = me.value;
    me.fire('afterrender');
    me.fire('render');
  },
  /*
   * @param {*} value
   * @param {Boolean} onInput
   */
  set: function(value, onInput){
    var me = this;

    me.el.firstChild().update(value);
    if(onInput !== false){
      me.onInput();
    }
  },
  /*
   * @returns {String}
   */
  get: function(){
    var me = this;

    return me.el.firstChild().dom.innerHTML;
  },
});/**
 * @class Fancy.ReCaptcha
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.ReCaptcha', 'Fancy.ReCaptcha'], {
  type: 'field.recaptcha',
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    Fancy.apply(me, config);

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('focus', 'blur', 'input', 'enter', 'up', 'down', 'change', 'key');

    me.Super('init', arguments);

    me.tpl = new Fancy.Template(me.tpl);
    me.render();

    me.name = 'recaptcha';

    //me.ons();

    if( me.hidden ){
      me.el.css('display', 'none');
    }

    if( me.style ){
      me.el.css(me.style);
    }

    var s = document.createElement("script");

    s.type = "text/javascript";
    s.src = 'https://www.google.com/recaptcha/api.js';

    Fancy.get(document.head).append(s);
  },
  /*
   * @return {'wait'|*}
   */
  get: function(){
    var me = this,
      formReCaptchaEl = me.el.select('form');

    if( me.value ){
      return me.value;
    }

    me.value = 'wait';

    formReCaptchaEl.one('submit', function(e){
      e.preventDefault();
      me.value = $(this).serialize().replace('g-recaptcha-response=', '');
    });

    formReCaptchaEl.submit();

    return me.value;
  },
  fieldCls: 'fancy fancy-field',
  value: '',
  width: 100,
  tpl: [
    '<form method="POST">',
    '<div class="g-recaptcha" data-sitekey="{key}"></div>',
    '</form>'
  ]
});/*
 * @class Fancy.Tab
 * @extends Fancy.Widget
 */
Fancy.define(['Fancy.form.field.Tab', 'Fancy.Tab'], {
  mixins: [
    Fancy.form.field.Mixin
  ],
  extend: Fancy.Widget,
  type: 'field.tab',
  /*
   * @constructor
   * @param {Object} config
   */
  constructor: function(config){
    var me = this,
      config = config || {};

    Fancy.apply(me, config);

    me.Super('const', arguments);
  },
  /*
   *
   */
  init: function(){
    var me = this;

    me.addEvents('collapsed', 'expanded');

    me.Super('init', arguments);

    var i = 0,
      iL = me.items.length,
      isItemTop;

    for(;i<iL;i++){
      var item = me.items[i];

      if( item.labelAlign === 'top' ){
        isItemTop = true;
        //break;
        if( i === 0 ){
          item.style = {
            'padding-left': '0px'
          };
        }
      }
    }

    me.preRender();
    me.render();
  },
  fieldCls: 'fancy fancy-field-tab',
  value: '',
  width: 100,
  emptyText: '',
  tpl: [
    '<div class="fancy-field-text fancy-field-tab-items">',
    '</div>'
  ]
});