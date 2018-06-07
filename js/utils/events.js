/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from "jquery";

/**
 * Action on opened select2 dropdown.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {Select2Scroller} Event.data The select2 scroller instance
 */
export function onOpen(event) {
    if (null !== event.data.$wrapper) {
        event.data.$wrapper.scroller('resizeScrollbar');

        return;
    }

    let self = event.data,
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
 */
export function onClose(event) {
    let self = event.data,
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
 */
export function onOptionInserted(event) {
    if (null !== event.data.$wrapper) {
        event.data.$wrapper.scroller('resizeScrollbar');
    }
}
