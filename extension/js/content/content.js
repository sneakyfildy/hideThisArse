(function (baseObj){
    "use strict";
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    function ready (){
        if (!readyFired) {
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            readyList = [];
        }
    }
    function readyStateChange (){
        if (document.readyState === "complete") {
            ready();
        }
    }
    var docReady = function (callback, context){
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        if (readyFired) {
            setTimeout(function (){
                callback(context);
            }, 1);
            return;
        }else{
            readyList.push({fn: callback, ctx: context});
        }
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        }else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready, false);
                window.addEventListener("load", ready, false);
            }else{
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    };


    var targetUserIds = ['17615'];
    var collapsedCls = 'hta-collapsed';

    docReady(function(){debugger;
        setup();
        var targetNode = document.querySelector('#page_wrapper');

        // Options for the observer (which mutations to observe)
        var config = {childList: true, attributes: true};

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList){debugger;
            console.log('mutation page');
            setup();
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    });

    function setup (){
        // Select the node that will be observed for mutations
        var targetNode = document.querySelector('.comments');

        // Options for the observer (which mutations to observe)
        var config = {childList: true, attributes: true};

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList){
            console.log('mutation comments');
            for (var mutation of mutationsList) {
                if (mutation.target.classList.contains('comments--ready')) {
                    processComments(targetUserIds);
                }
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

// Later, you can stop observing
//observer.disconnect();
    }

    function processComments (userIds){
        var outerComments;

        outerComments = document.querySelectorAll('.comments__item__space');
        outerComments.forEach(function (outerComment){
            var hrefEl = outerComment.firstElementChild.querySelector('.comments__item__user');
            if (!hrefEl) {
                console.log('Something has changed in the markup, sorry. You can always fork and fix or report: https://github.com/sneakyfildy/hideThisArse');
                return;
            }
            var userId = hrefEl.getAttribute('href').replace(/[^\d]/g, '');
            if (userIds.indexOf(userId) !== -1) {
                outerComment.classList.add('hta-marked-comment');
                outerComment.classList.add(collapsedCls);
                var commentItemContent = outerComment.querySelector('.comments__item__content');
                var commentItemText = commentItemContent.querySelector('.comments__item__text');
                commentItemText.classList.add('hta-collapsed-text');


                var humorShit = makeHumorShit(commentItemText);
                commentItemContent.insertBefore(humorShit, commentItemContent.firstElementChild);

                var expanderControl = makeExpander(outerComment);
                commentItemContent.insertBefore(expanderControl, commentItemContent.firstElementChild);
            }
        });
    }

    function makeExpander (outerComment){
        var el = document.createElement('span');
        el.setAttribute('class', 'hta-expander');

        el.addEventListener('click', toggleCollapsed.bind(outerComment));

        return el;
    }

    function toggleCollapsed (){
        this.classList.contains(collapsedCls)
            ? this.classList.remove(collapsedCls)
            : this.classList.add(collapsedCls);

    }

    function makeHumorShit (text){
        var el, wordsCount;
        try {
            wordsCount = text.innerText.replace(/\s+/gm, ' ').split(' ').length || 0;
        } catch (err) {
            wordsCount = 0;
        }
        wordsCount = wordsCount > 50 ? getRandomInt(10e6, 10e10) : wordsCount;

        el = document.createElement('span');
        el.setAttribute('class', 'hta-humor-shit');
        el.innerText = wordsCount + ' word' + (wordsCount > 1 ? 's' : '') + ' of crap';
        return el;
    }

    function getRandomInt (min, max){
        min = typeof min !== 'number' ? 0 : (min || 0);
        max = typeof max !== 'number' ? 0 : (max || 0);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})();