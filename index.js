;
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function ($) {
    'use strict';
    var Wet = window.Wet || {};
    var TRACK = 'wet-track',
        $TRACK = '.' + TRACK,
        MOBILE = 'wet-mobile',
        $MOBILE = '.' + MOBILE,
        WRAPPER = 'wrapper-slider',
        $WRAPPER = '.' + WRAPPER,
        ITEM = 'slide-item',
        $ITEM = '.' + ITEM,
        BTN_RIGHT = 'btn-right',
        BTN_LEFT = 'btn-left',
        $BTN_RIGHT = '.' + BTN_RIGHT,
        $BTN_LEFT = '.' + BTN_LEFT,
        ACTIVE = 'active';

    Wet = (function () {

        var instanceUid = 0;

        function Wet(element, settings) {

            var _ = this,
                dataSettings;

            _.defaults = {
                speed: 600,
                setIntervalTime: 5000
            };

            _.init = {
                length: 0,
                itemWidth: 0,
                lastAnimation: 0,
                index: 0,
                indexMobile: 1
            };

            $.extend(_, _.init); // glues object jquery method

            _.options = $.extend({}, _.defaults, settings); // default options

            _.$slider = $(element); // our element

            _.initials(true); // function start

        }

        return Wet; // return our function or we got undefined

    }());

    Wet.prototype.start = function () {
        var _ = this,
            slideItem = _
                .$slider
                .find($ITEM);
        if (slideItem.length) {
            if (_.options.speed > 1000) {
                _.options.speed = 500;
            }
            slideItem
                .first()
                .addClass(ACTIVE);
            _.circle();
            _.wrapperSlider();
            _.navigation();
            _.handleEvents();
        }
    };
    Wet.prototype.navigation = function () {
        var _ = this,
            slideItem = _
                .$slider
                .find($ITEM),
            container = _
                .$slider
                .append('<div class="navigation"></div>')
        for (var i = 0; i < slideItem.length; i++) {
            _
                .$slider
                .find('.navigation')
                .append('<div class="slide-btn" data-number=' + i + '><div class="circle-text">' + slideItem.find('.rest__title_h4').eq(i).text() + '</div></div>');
        }
    }
    Wet.prototype.circle = function () {
        var _ = this;
        _
            .$slider
            .append('<div class="slide-circle"></div>');
    };

    Wet.prototype.handleEvents = function () {
        var _ = this;
        _.moveOnClick();
        $(window).on('load resize', function () {
            _.styleMobile();
            _.itemWidthResize();
            _.clonedItems();
            _.mobileNavigation();
            _.buttonMove();
        });
    };
    Wet.prototype.winWidth = function () {
        return $(window).width();
    };
    Wet.prototype.counterAnimation = function (currentIndex, prevIndex) {
        if (currentIndex == 0) {
            if (prevIndex == 4) {
                return prevIndex * 90;
            } else if (prevIndex == 3) {
                return prevIndex * 120;
            }
        }
        return currentIndex * 65;
    };

    Wet.prototype.styleMobile = function () {
        var _ = this;
        var item = _
            .$slider
            .find($ITEM);
        var $winWidth = _.winWidth();
        var track = _
            .$slider
            .children();
        var wrapper = $(document).find($WRAPPER);

        if (_.winWidth() < 768) {
            wrapper.addClass(MOBILE);
        } else {
            wrapper.removeClass(MOBILE)
        }

        if ($winWidth < 480) {
            if (!track.hasClass(TRACK)) {
                _
                    .$slider
                    .wrapInner('<div class="wet-track"></div>');
            }
            _
                .$slider
                .find($TRACK)
                .width(($winWidth) * _.length);
            item.css('min-width', Math.round($winWidth));
        } else if ($winWidth < 768) {
            if (!track.hasClass(TRACK)) {
                _
                    .$slider
                    .wrapInner('<div class="wet-track"></div>');
            }
            _
                .$slider
                .find($TRACK)
                .width(($winWidth) * _.length);
            item.css('min-width', Math.round($winWidth / 2));
        } else {
            item.removeAttr('style');
            if (track.hasClass(TRACK)) {
                _
                    .$slider
                    .find($ITEM)
                    .unwrap();
            }
        }

    };

    Wet.prototype.clonedItems = function () {
        var _ = this;
        var cloned = 'slide-item-cloned';
        if (_.winWidth() < 768) {
            var first = _
                    .$slider
                    .find($ITEM)
                    .first()
                    .clone()
                    .addClass(cloned),
                last = _
                    .$slider
                    .find($ITEM)
                    .last()
                    .clone()
                    .addClass(cloned);

            if (!_.$slider.find('.' + cloned).length) {
                _
                    .$slider
                    .find($TRACK)
                    .append(first);
                _
                    .$slider
                    .find($TRACK)
                    .prepend(last);
            }

        } else {
            _
                .$slider
                .find(cloned)
                .remove();
        }
        _.length = _
            .$slider
            .find($TRACK)
            .find($ITEM)
            .length
    };
    Wet.prototype.newDate = function () {
        return new Date().getTime();
    }
    Wet.prototype.nextSlide = function (index, prevIndex) {
        var _ = this;
        var container = _
                .$slider
                .find('.navigation'),
            slideBtn = container.find('.slide-btn'),
            slideItem = _
                .$slider
                .find($ITEM);

        slideItem
            .eq(index)
            .addClass(ACTIVE);
        slideBtn
            .eq(index)
            .addClass(ACTIVE);
        if (index == 0) {
            slideItem
                .eq(index + 4)
                .removeClass(ACTIVE);
            slideBtn
                .eq(index + 4)
                .removeClass(ACTIVE);
        } else {
            slideItem
                .eq(index)
                .prev()
                .removeClass(ACTIVE);
            slideBtn
                .eq(index)
                .prev()
                .removeClass(ACTIVE);
        }
        _.animation(index, prevIndex - 1);
    }
    Wet.prototype.timeResult = function (timeNow, lastAnimation) {
        var _ = this;
        return timeNow - lastAnimation < _.options.speed + 100;
    }
    Wet.prototype.counter = function (value) {
        switch (value) {
            case 'INCREMENT':
                if (this.index >= 4) {
                    return this.index = 0;
                }
                return this.index++;
                break;
            default:
                return index;
        }
    }

    Wet.prototype.moveOnClick = function () {
        var _ = this,
            prevIndex = 0,
            container = _
                .$slider
                .find('.navigation'),
            slideBtn = container.find('.slide-btn'),
            slideItem = _
                .$slider
                .find($ITEM);
        var lastAnimation = 0;
        slideBtn
            .first()
            .addClass(ACTIVE);

        var next = _
            .$slider
            .find('.next');

        var cheking = true;
        // if dekstop > 768 we'll work
        setInterval(function () {
            if (cheking && _.winWidth() > 768) {

                // get time animation
                var timeNow = _.newDate();

                // if our user do more clicks we return without animation
                if (_.timeResult(timeNow, lastAnimation)) {
                    return
                }

                // function counter for index
                _.counter('INCREMENT');

                // function next slide
                _.nextSlide(_.index, prevIndex);
                // after we need specify last index, and lastAnimation
                prevIndex = _.index;
                lastAnimation = timeNow;

            }
        }, _.options.setIntervalTime);
        next
            .off()
            .on('click', function () {
                // get time animation
                var timeNow = _.newDate();

                // if our user do more clicks we return without animation
                if (_.timeResult(timeNow, lastAnimation)) {
                    return
                }

                // function counter for index
                _.counter('INCREMENT')

                // function next slide
                _.nextSlide(_.index, prevIndex);

                // after we need specify last index, and lastAnimation
                prevIndex = _.index;
                lastAnimation = timeNow;

                // we started with true after move we return false for user
                cheking = false;
            });

        slideBtn
            .off()
            .on('click', function (event) {
                // get time animation
                var timeNow = _.newDate();

                // if our user do more clicks we return without animation
                if (_.timeResult(timeNow, lastAnimation)) {
                    return event.preventDefault();
                }

                // this function returned current index that user made click
                var currentIndex = _.currentIndex($(this));
                // after we save current index for common
                _.index = currentIndex;

                // add active class to current index that we get up
                slideItem
                    .eq(currentIndex)
                    .addClass(ACTIVE);

                // add active class to current index that we get up
                slideBtn
                    .eq(currentIndex)
                    .addClass(ACTIVE);

                // animation for circle
                _.animation(currentIndex, prevIndex);

                // if user will do more click this (block if) safe slider from bugs
                if (prevIndex != currentIndex) {
                    slideItem
                        .eq(prevIndex)
                        .removeClass(ACTIVE);
                    slideBtn
                        .eq(prevIndex)
                        .removeClass(ACTIVE);
                }

                // after we need specify last index, and lastAnimation
                prevIndex = currentIndex;
                lastAnimation = timeNow;

                // we started with true after move we return false for user
                cheking = false;
            });
    };

    Wet.prototype.itemWidthResize = function () {
        var _ = this;
        if (_.winWidth() < 480) {
            return Math.round(_.winWidth());
        } else if (_.winWidth() < 768) {
            return Math.round(_.winWidth() / 2);
        }
    };

    Wet.prototype.currentIndex = function (index) {
        return parseInt(index.attr('data-number'));
    };

    Wet.prototype.wrapperSlider = function () {
        var _ = this;
        _
            .$slider
            .wrap('<div class="wrapper-slider"></div>')
    };

    Wet.prototype.buttonMove = function () {

        // make index
        var _ = this;
        // index = 1; make anim with zero
        var lastAnimation = 0;

        // find wrapper
        var wrapper = $(document).find($WRAPPER);

        // find track
        var track = _
            .$slider
            .find($TRACK);

        // left and right buttons
        var left = wrapper.find($BTN_LEFT),
            right = wrapper.find($BTN_RIGHT);

        // length our items
        var length = track
            .find('.slide-item')
            .length;

        // width 1 item
        var width = _.itemWidthResize();

        // apply to track width * length
        track.css('width', width * length + 'px');

        // found item we apply to width
        track
            .find('.slide-item')
            .css('min-width', width + 'px');

        // for track width * index on resize
        track.css({
            transform: 'translateX(-' + width * _.indexMobile + 'px)',
            transition: 'transform ' + 0 + 'ms'
        });

        if (_.winWidth() < 768) {
            var value = width
            _
                .$slider
                .swipe({
                    swipeStatus: function (event, phase, direction, distance) {

                        // width items
                        var currentWidth = _.indexMobile * width;

                        // default for move will current width
                        var move = currentWidth;

                        // get left distance
                        if (direction === 'left') {
                            move = distance + currentWidth;
                            if(move >= (length - 2) * (width * 1.1)){
                                move = (length - 2) * (width * 1.1);
                            }
                        }
                        // get right distance
                        if (direction === 'right') {
                            move = -distance + currentWidth;
                            if(move <= (width * 1) / 3){
                                move = Math.round((width * 1) / 3);
                            }
                        }
                            
                        // if user ended
                        if (phase === "end") {
                            // left side

                            if (direction == 'left') {
                                // current plus next index
                                _.indexMobile = Math.ceil(move / width);

                                if (_.indexMobile > length - 2) {
                                    // if user will be silly, than we make speed for limitation
                                    setTimeout(function () {
                                        // animation for track
                                        track.css({
                                            transform: 'translateX(-' + width * 1 + 'px)',
                                            transition: 'transform ' + 0 + 'ms'
                                        });
                                        // now index started again 1
                                        _.indexMobile = 1;

                                    }, _.options.speed);
                                }

                                // sum index and width item
                                value = _.indexMobile * _.itemWidthResize();

                                // apply to track animation
                                track.css({
                                    transform: 'translateX(' + -value + 'px)',
                                    transition: 'all 0.5s'
                                });
                            }

                            // ridth side

                            if (direction == 'right') {

                                // current minus next index
                                _.indexMobile = Math.floor(move / width);

                                if (_.indexMobile < 1) {
                                    // if user will be silly, than we make speed for limitation
                                    setTimeout(function () {
                                        // animation for track
                                        track.css({
                                            transform: 'translateX(-' + width * (length - 2) + 'px)',
                                            transition: 'transform ' + 0 + 'ms'
                                        });
                                        // now index it is length
                                        _.indexMobile = length - 2;
                                    }, _.options.speed);
                                }

                                // sum index and width item
                                value = _.indexMobile * _.itemWidthResize();

                                // apply to track animation
                                track.css({
                                    transform: 'translateX(' + -value + 'px)',
                                    transition: 'all 0.5s'
                                });

                                // after we need specify last lastAnimation
                            }

                        } else if (phase === 'move') {

                            if(move >= (length - 2) * (width * 1.1)){
                                phase = "end";
                                return event.preventDefault();
                            }

                            if(move <= (width * 1) / 3){
                                phase = "end";
                                return event.preventDefault();
                            }
                            // apply to track animation
                            track.css({
                                transform: 'translateX(-' + move + 'px)',
                                transition: 'transform ' + 0 + 'ms'
                            });
                        }

                    },
                    triggerOnTouchEnd: true,
                    threshold: 0
                });

        } else {
            _
                .$slider
                .swipe("disable");
        }

        left
            .off('click')
            .on('click', function () {

                // get time animation
                var timeNow = _.newDate();

                // if our user do more clicks we return without animation
                if (_.timeResult(timeNow, lastAnimation)) {
                    return
                }

                _.indexMobile -= 1;
                if (_.indexMobile < 1) {
                    setTimeout(function () {
                        track.css({
                            transform: 'translateX(-' + width * (length - 2) + 'px)',
                            transition: 'transform ' + 0 + 'ms'
                        });
                        _.indexMobile = length - 2;
                    }, _.options.speed);

                }

                // apply to track animation
                track.css({
                    transform: 'translateX(-' + width * _.indexMobile + 'px)',
                    transition: 'transform ' + _.options.speed + 'ms'
                });

                // after we need specify last lastAnimation
                lastAnimation = timeNow;
            });
        right
            .off('click')
            .on('click', function () {
                // get time animation
                var timeNow = _.newDate();

                // if our user do more clicks we return without animation
                if (_.timeResult(timeNow, lastAnimation)) {
                    return
                }

                if (_.indexMobile > length - 3) {
                    setTimeout(function () {
                        track.css({
                            transform: 'translateX(-' + width * 1 + 'px)',
                            transition: 'transform ' + 0 + 'ms'
                        });
                        _.indexMobile = 1;
                    }, _.options.speed);
                }

                // common mobile index
                _.indexMobile += 1;

                track.css({
                    transform: 'translateX(-' + width * _.indexMobile + 'px)',
                    transition: 'transform ' + _.options.speed + 'ms'
                });

                // after we need specify last index, and lastAnimation
                lastAnimation = timeNow;

            });
    };
    Wet.prototype.mobileNavigation = function () {
        var _ = this;
        var wrapper = $(document).find('.wrapper-slider');
        if (wrapper.hasClass(MOBILE)) {
            if (!wrapper.find('.btn-mobile').length) {
                _
                    .$slider
                    .parent()
                    .prepend('<div class="btn-mobile btn-left"><span></span></div>');
                _
                    .$slider
                    .parent()
                    .append('<div class="btn-mobile btn-right"><span></span></div>');
            }
        } else {
            wrapper
                .find('.btn-mobile')
                .remove();
        }
    };

    Wet.prototype.animation = function (currentIndex, prevIndex) {
        var _ = this;
        var circle = _
                .$slider
                .find('.navigation'),
            index = _.counterAnimation(currentIndex, prevIndex),
            slideBtn = circle.find('.slide-btn');

        circle.css({
            transform: 'rotate(-' + index + 'deg)',
            transition: 'transform ' + _.options.speed + 'ms'
        });
        slideBtn
            .find('.circle-text')
            .css({
                transform: 'rotate(' + index + 'deg)',
                transition: 'transform ' + _.options.speed + 'ms'
            });

        setTimeout(function () {
            circle.css({transition: ''})
            slideBtn
                .find('.circle-text')
                .css({transition: ''})
        }, _.options.speed)

        if (currentIndex == 0) {
            setTimeout(function () {
                circle.css({transform: '', transition: ''})
                slideBtn
                    .find('.circle-text')
                    .css({transform: '', transition: ''})
            }, _.options.speed)
        }

    };

    Wet.prototype.initials = function (creation) {
        var _ = this;
        if (creation) {
            _.start();
            _
                .$slider
                .trigger('init', [_]);
        }
    };

    $.fn.wet = function () {
        var _ = this,
            opt = arguments[0],
            args = Array
                .prototype
                .slice
                .call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined') 
                _[i].wet = new Wet(_[i], opt);
            else 
                ret = _[i]
                    .wet[opt]
                    .apply(_[i].wet, args);
            if (typeof ret != 'undefined') 
                return ret;
            }
        return _;
    };

}));
