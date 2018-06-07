/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @param {jQuery} $
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'select2', '@fxp/jquery-scroller'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Action on opened select2 dropdown.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {Select2Scroller} Event.data The select2 scroller instance
     *
     * @private
     */
    function onOpen(event) {
        if (null !== event.data.$wrapper) {
            event.data.$wrapper.scroller('resizeScrollbar');

            return;
        }
        var self = event.data,
            select2 = self.$element.data('select2'),
            $dropdown = select2.$dropdown,
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
     *
     * @private
     */
    function onClose(event) {
        var self = event.data,
            select2 = self.$element.data('select2'),
            $dropdown = $(select2.dropdown),
            $results = $('.select2-results', $dropdown);

        select2.$results.off('DOMNodeInserted.fxp.select2scroller', onOptionInserted);
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
     *
     * @private
     */
    function onOptionInserted(event) {
        if (null !== event.data.$wrapper) {
            event.data.$wrapper.scroller('resizeScrollbar');
        }
    }

    // SELECT2 SCROLLER CLASS DEFINITION
    // =================================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this Select2Scroller
     */
    var Select2Scroller = function (element, options) {
        this.guid     = jQuery.guid;
        this.options  = $.extend(true, {}, Select2Scroller.DEFAULTS, options);
        this.scrollerOptions = $.extend(true, {}, $.fn.scroller.Constructor.DEFAULTS, options, {
            'contentSelector': '.select2-results__options'
        });
        this.$element = $(element);
        this.$wrapper = null;

        this.$element.on('select2:open.fxp.select2scroller', null, this, onOpen);
        this.$element.on('select2:close.fxp.select2scroller', null, this, onClose);
    },
        old;

    /**
     * Defaults options.
     *
     * @type {object}
     */
    Select2Scroller.DEFAULTS = {
        resultsWrapperClass: 'scroller-wrapper-select2-results'
    };

    /**
     * Destroy instance.
     *
     * @this Select2Scroller
     */
    Select2Scroller.prototype.destroy = function () {
        var select2 = this.$element.data('select2');

        this.$element.off('select2:open.fxp.select2scroller', onOpen);
        this.$element.off('select2:close.fxp.select2scroller', onClose);

        if (null !== this.$wrapper) {
            this.$wrapper.scroller('destroy');
        }

        this.$element.removeData('st.select2scroller');

        delete this.guid;
        delete this.options;
        delete this.scrollerOptions;
        delete this.$element;
        delete this.$wrapper;
    };


    // SELECT2 SCROLLER PLUGIN DEFINITION
    // ==================================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.select2scroller'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                $this.data('st.select2scroller', (data = new Select2Scroller(this, options)));
            }

            if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    }

    old = $.fn.select2Scroller;

    $.fn.select2Scroller             = Plugin;
    $.fn.select2Scroller.Constructor = Select2Scroller;


    // SELECT2 SCROLLER NO CONFLICT
    // ============================

    $.fn.select2Scroller.noConflict = function () {
        $.fn.select2Scroller = old;

        return this;
    };


    // SELECT2 SCROLLER DATA-API
    // =========================

    $(window).on('load', function () {
        $('[data-select2-jquery-scroller="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));
