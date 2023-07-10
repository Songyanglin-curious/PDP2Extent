;
jQuery.fn.offset = function (options, returnObject) {
    var x = 0, y = 0, elem = this[0], parent = this[0], sl = 0, st = 0, options = jQuery.extend({ margin: true, border: true, padding: false, scroll: true }, options || {});
    do {
        x += parent.offsetLeft || 0;
        y += parent.offsetTop || 0;
        // Mozilla and IE do not add the border
        if (jQuery.browser.mozilla || jQuery.browser.msie) {
            // get borders
            var bt = parseInt(jQuery.css(parent, 'borderTopWidth')) || 0;
            var bl = parseInt(jQuery.css(parent, 'borderLeftWidth')) || 0;
            // add borders to offset
            x += bl;
            y += bt;
            // Mozilla removes the border if the parent has overflow property other than visible
            if (jQuery.browser.mozilla && parent != elem && jQuery.css(parent, 'overflow') != 'visible') {
                x += bl;
                y += bt;
            }
        }
        var op = parent.offsetParent;
        if (op && (op.tagName == 'BODY' || op.tagName == 'HTML')) {
            // Safari doesn't add the body margin for elments positioned with static or relative
            if (jQuery.browser.safari && jQuery.css(parent, 'position') != 'absolute') {
                x += parseInt(jQuery.css(op, 'marginLeft')) || 0;
                y += parseInt(jQuery.css(op, 'marginTop')) || 0;
            }
            // Exit the loop
            break;
        }
        if (options.scroll) {
            // Need to get scroll offsets in-between offsetParents
            do {
                sl += parent.scrollLeft || 0;
                st += parent.scrollTop || 0;
                parent = parent.parentNode;
                // Mozilla removes the border if the parent has overflow property other than visible
                if (jQuery.browser.mozilla && parent != elem && parent != op && parent.style && jQuery.css(parent, 'overflow') != 'visible') {
                    y += parseInt(jQuery.css(parent, 'borderTopWidth')) || 0;
                    x += parseInt(jQuery.css(parent, 'borderLeftWidth')) || 0;
                }
            } while (parent != op);
        } else {
            parent = parent.offsetParent;
        }
    } while (parent);
    if (!options.margin) {
        x -= parseInt(jQuery.css(elem, 'marginLeft')) || 0;
        y -= parseInt(jQuery.css(elem, 'marginTop')) || 0;
    }
    // Safari and Opera do not add the border for the element
    if (options.border && (jQuery.browser.safari || jQuery.browser.opera)) {
        x += parseInt(jQuery.css(elem, 'borderLeftWidth')) || 0;
        y += parseInt(jQuery.css(elem, 'borderTopWidth')) || 0;
    } else if (!options.border && !(jQuery.browser.safari || jQuery.browser.opera)) {
        x -= parseInt(jQuery.css(elem, 'borderLeftWidth')) || 0;
        y -= parseInt(jQuery.css(elem, 'borderTopWidth')) || 0;
    }
    if (options.padding) {
        x += parseInt(jQuery.css(elem, 'paddingLeft')) || 0;
        y += parseInt(jQuery.css(elem, 'paddingTop')) || 0;
    }
    // Opera thinks offset is scroll offset for display: inline elements
    if (options.scroll && jQuery.browser.opera && jQuery.css(elem, 'display') == 'inline') {
        sl -= elem.scrollLeft || 0;
        st -= elem.scrollTop || 0;
    }
    var returnValue = options.scroll ? { top: y - st, left: x - sl, scrollTop: st, scrollLeft: sl }
            : { top: y, left: x };
    if (returnObject) { jQuery.extend(returnObject, returnValue); return this; }
    else { return returnValue; }
};