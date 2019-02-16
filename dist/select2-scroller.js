var FxpSelect2Scroller = (function (exports, $, FxpScroller) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  FxpScroller = FxpScroller && FxpScroller.hasOwnProperty('default') ? FxpScroller['default'] : FxpScroller;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  /**
   * Define the class as Jquery plugin.
   *
   * @param {String}      pluginName  The name of jquery plugin defined in $.fn
   * @param {String}      dataName    The key name of jquery data
   * @param {function}    ClassName   The class name
   * @param {boolean}     [shorthand] Check if the shorthand of jquery plugin must be added
   * @param {String|null} dataApiAttr The DOM data attribute selector name to init the jquery plugin with Data API, NULL to disable
   * @param {String}      removeName  The method name to remove the plugin data
   */

  function pluginify (pluginName, dataName, ClassName) {
    var shorthand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var dataApiAttr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var removeName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'destroy';
    var old = $.fn[pluginName];

    $.fn[pluginName] = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var resFunc, resList;
      resList = this.each(function (i, element) {
        var $this = $(element),
            data = $this.data(dataName);

        if (!data) {
          data = new ClassName(element, _typeof(options) === 'object' ? options : {});
          $this.data(dataName, data);
        }

        if (typeof options === 'string' && data) {
          if (data[options]) {
            resFunc = data[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          } else if (data.constructor[options]) {
            resFunc = data.constructor[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          }

          if (options === removeName) {
            $this.removeData(dataName);
          }
        }
      });
      return 1 === resList.length && undefined !== resFunc ? resFunc : resList;
    };

    $.fn[pluginName].Constructor = ClassName; // Shorthand

    if (shorthand) {
      $[pluginName] = function (options) {
        return $({})[pluginName](options);
      };
    } // No conflict


    $.fn[pluginName].noConflict = function () {
      return $.fn[pluginName] = old;
    }; // Data API


    if (null !== dataApiAttr) {
      $(window).on('load', function () {
        $(dataApiAttr).each(function () {
          var $this = $(this);
          $.fn[pluginName].call($this, $this.data());
        });
      });
    }
  }

  var DEFAULT_OPTIONS = {};
  /**
   * Base class for plugin.
   */

  var BasePlugin =
  /*#__PURE__*/
  function () {
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function BasePlugin(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePlugin);

      this.guid = $.guid;
      this.options = $.extend(true, {}, this.constructor.defaultOptions, options);
      this.$element = $(element);
    }
    /**
     * Destroy the instance.
     */


    _createClass(BasePlugin, [{
      key: "destroy",
      value: function destroy() {
        var self = this;
        Object.keys(self).forEach(function (key) {
          delete self[key];
        });
      }
      /**
       * Set the default options.
       * The new values are merged with the existing values.
       *
       * @param {object} options
       */

    }], [{
      key: "defaultOptions",
      set: function set(options) {
        DEFAULT_OPTIONS[this.name] = $.extend(true, {}, DEFAULT_OPTIONS[this.name], options);
      }
      /**
       * Get the default options.
       *
       * @return {object}
       */
      ,
      get: function get() {
        if (undefined === DEFAULT_OPTIONS[this.name]) {
          DEFAULT_OPTIONS[this.name] = {};
        }

        return DEFAULT_OPTIONS[this.name];
      }
    }]);

    return BasePlugin;
  }();

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Action on opened select2 dropdown.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {Select2Scroller} Event.data The select2 scroller instance
   */

  function onOpen(event) {
    if (null !== event.data.$wrapper) {
      event.data.$wrapper.scroller('resizeScrollbar');
      return;
    }

    var self = event.data,
        select2$$1 = self.$element.data('select2'),
        $dropdown = select2$$1.$dropdown,
        $results = $('.select2-results', $dropdown);
    $results.addClass(self.options.resultsWrapperClass);
    self.$wrapper = $results.scroller(self.scrollerOptions);
    self.$element.data('select2').$results.on('DOMNodeInserted.fxp.select2scroller', null, self, onOptionInserted);
  }
  /**
   * Action on close select2 dropdown.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {Select2Scroller} Event.data The select2 scroller instance
   */

  function onClose(event) {
    var self = event.data,
        select2$$1 = self.$element.data('select2'),
        $dropdown = $(select2$$1.dropdown),
        $results = $('.select2-results', $dropdown);
    select2$$1.$results.off('DOMNodeInserted.fxp.select2scroller', onOptionInserted);
    $results.scroller('destroy');
    $results.removeClass(self.options.resultsWrapperClass);
    self.$wrapper = null;
  }
  /**
   * Action on inserted element in results.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {Select2Scroller} Event.data The select2 scroller instance
   */

  function onOptionInserted(event) {
    if (null !== event.data.$wrapper) {
      event.data.$wrapper.scroller('resizeScrollbar');
    }
  }

  /**
   * Select2 Scroller class.
   */

  var Select2Scroller =
  /*#__PURE__*/
  function (_BasePlugin) {
    _inherits(Select2Scroller, _BasePlugin);

    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function Select2Scroller(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Select2Scroller);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Select2Scroller).call(this, element, options));
      _this.scrollerOptions = $.extend(true, {}, FxpScroller.defaultOptions, options, {
        'contentSelector': '.select2-results__options'
      });
      _this.$wrapper = null;

      _this.$element.on('select2:open.fxp.select2scroller', null, _assertThisInitialized(_this), onOpen);

      _this.$element.on('select2:close.fxp.select2scroller', null, _assertThisInitialized(_this), onClose);

      return _this;
    }
    /**
     * Destroy the instance.
     */


    _createClass(Select2Scroller, [{
      key: "destroy",
      value: function destroy() {
        this.$element.off('select2:open.fxp.select2scroller', onOpen);
        this.$element.off('select2:close.fxp.select2scroller', onClose);

        if (null !== this.$wrapper) {
          this.$wrapper.scroller('destroy');
        }

        _get(_getPrototypeOf(Select2Scroller.prototype), "destroy", this).call(this);
      }
    }]);

    return Select2Scroller;
  }(BasePlugin);
  Select2Scroller.defaultOptions = {
    resultsWrapperClass: 'scroller-wrapper-select2-results'
  };
  pluginify('select2Scroller', 'fxp.select2scroller', Select2Scroller, true, '[data-select2-scroller="true"]');

  exports.default = Select2Scroller;

  return exports;

}({}, jQuery, FxpScroller));
