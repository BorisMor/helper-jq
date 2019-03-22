(function (window) {
    'use strict';

    var ClassHelperJQ = function () {
        var self = this;

        this.debug = false;
        this.prefixClassCSS = 'js';

        /**
         * Замыкание для linkAction
         * @param {*} el
         * @param {*} context
         * @param {*} handler
         * @param {*} action
         */
        function _linkAction(el, context, handler, action) {
            el.on(action, function (event) {
                event.preventDefault();
                startFunctionInContext(handler, context, [event]);
            });
        }

        /**
         * Выполнить метом в определенном контексте
         * @param handler
         * @param context
         * @param params
         */
        function startFunctionInContext(handler, context, params) {
            params = typeof params === "undefined" ? [] : params;

            if (typeof context[handler] === "function") {
                context[handler].apply(context, params);
            } else {
                console.error('not function "' + handler + '"', context, params);
            }
        }

        /**
         * Проверяет что контекст рабочий для данного элемента
         * @param el
         * @param context
         * @returns {boolean}
         */
        this.isWorkContext = function (el, context) {
            var nameWorkController = el.data('context');

            if (!nameWorkController) {
                var workController = el.closest('[data-controller]');
                if (!self.empty(workController)) {
                    var nameWorkController = workController.data('controller');
                    el.data('context', nameWorkController);
                }
            }

            var currentController = self.getContextName(context);

            if (nameWorkController) {
                return nameWorkController === currentController;
            } else {
                // без четко указанного контролера
                el.data('context', currentController);
                return true;
            }
        };

        /**
         * Связать экшены указанные в атрибутах
         * data-handler - метод на объекте
         * data-action - событие при котором вызываем метод. По умолчанию click
         *
         * @param {*} rootDOM корневой DOM элемент
         * @param {*} context Объект у котрого ищем метод
         */
        this.linkAction = function (rootDOM, context) {
            if (self.empty(rootDOM)) {
                console.error('linkAction: rootDOM is empty', context);
                return;
            }

            var contextName = self.getContextName(context);
            var lenContextName = contextName.length + 1;

            var lstElem = $(rootDOM).find('[data-handler]');
            for (var i = 0, len = lstElem.length; i < len; i++) {

                var el = $(lstElem[i]);
                var handler = el.data('handler');
                var action = el.data('action');
                action = (typeof action === "undefined") ? 'click' : action;

                if (!self.isWorkContext(el, context)) {
                    if (self.debug) {
                        console.log('skip linkAction', 'for ' + el.data('context'), handler, action, el, context);
                    }
                    continue;
                }

                // пропускаем название объекта
                if (handler.substr(0, lenContextName) === contextName + '.') {
                    handler = handler.substr(lenContextName);
                }

                if (self.debug) {
                    console.log('linkAction', handler, action, el, context);
                }

                _linkAction(el, context, handler, action);
            }
        };

        /**
         * Установить для объекта свойство
         * Свойства можно писать со вложением objectA.propertyB
         *
         * @param {*} obj
         * @param {*} prop
         * @param {*} value
         * @param {*} context Только для логов
         */
        this.assign = function (obj, prop, value, context) {
            if (typeof prop === "string")
                prop = prop.split(".");

            if (prop.length > 1) {
                var e = prop.shift();
                self.assign(
                    obj[e] = self.isObject(obj[e]) ? obj[e] : {},
                    prop,
                    value,
                    context);
            } else {
                var property = prop[0];
                if (obj.hasOwnProperty(property)) {
                    value.data('context-object', context);
                    obj[property] = value;
                } else {
                    console.error('not propery "' + property + '"', obj, context);
                }
            }
        };

        /**
         * Стантдартное подключение
         * @param context Контектс в котором будут выполнятся экшены
         * @param containerUI Контейнер для UI элементов
         * @param rootDOM Корневой элемент DOM дерева
         */
        this.standardConnection = function (context, containerUI, rootDOM) {
            if (typeof containerUI === "undefined") {
                containerUI = context.ui;
            }

            if (typeof rootDOM === "undefined") {
                rootDOM = containerUI.root;
            }

            self.linkAction(rootDOM, context); // дейсвия
            self.linkUI(rootDOM, containerUI, context); // подключить элементы UI
            self.setClassCSSContext(rootDOM, context); // Прописать на корневом элементе класс
        };


        /**
         * Установить на DOM элемент класс зависимый от контекcта
         */
        this.setClassCSSContext = function (DOM, context, prefix) {
            var prefix = typeof prefix === "undefined" ? self.prefixClassCSS : prefix;
            var nameContext = self.getContextName(context);
            $(DOM).addClass(prefix + nameContext);
        };

        /**
         * Сбор элементов интерфейсов
         * data-ui - подобрать элемент под указанным именем
         * data-ui-context - подобрать элемент через метод в контексте
         *
         * @param {*} rootDOM
         * @param {*} container
         * @param {*} context
         */
        this.linkUI = function (rootDOM, container, context) {
            if (self.empty(rootDOM)) {
                console.error('linkUI: rootDOM is empty', self);
                return;
            }

            var contextName = self.getContextName(context);
            var lenContextName = contextName.length + 1;

            var lstElem = $(rootDOM).find('[data-ui]');
            for (var i = 0, len = lstElem.length; i < len; i++) {
                var el = $(lstElem[i]);
                var nameUI = el.data('ui');
                var skipCheckContext = false;

                // пропускаем название объекта и не проверяем контекст
                if (nameUI.substr(0, lenContextName) === contextName + '.') {
                    nameUI = nameUI.substr(lenContextName);
                    skipCheckContext = true;
                }

                if (!skipCheckContext && !self.isWorkContext(el, context)) {
                    if (self.debug) { console.log('skip data-ui', 'for ' + el.data('context'), nameUI, el, context) }
                    continue;
                }

                if (self.debug) { console.log('data-ui', nameUI, el, context); }
                self.assign(container, nameUI, el, context)
            }

            // Объект собирается самими контекстом
            lstElem = self.empty(context) ? [] : $(rootDOM).find('[data-ui-context]');
            for (var i = 0, len = lstElem.length; i < len; i++) {
                var el = $(lstElem[i]);
                var handler = el.data('ui-context');
                var skipCheckContext = false;

                // пропускаем название объекта
                if (handler.substr(0, lenContextName) === contextName + '.') {
                    handler = handler.substr(lenContextName);
                    skipCheckContext = true; // пропустить проверку контекста
                }

                if (!skipCheckContext && !self.isWorkContext(el, context)) {
                    if (self.debug) { console.log('skip ui-context', 'for ' + el.data('context'), handler, el, context) }
                    continue;
                }

                if (self.debug) { console.log('data-ui-context', handler, el, context); }
                startFunctionInContext(handler, context, [el, container]);
            }

            self.checkUI(container, context);
        };

        /**
         * Проверка переменной на пустое значение
         * @param {*} value
         */
        this.empty = function (value) {
            return typeof value === 'undefined' || value === null || value === 0 ||
                (typeof value.length !== 'undefined' && value.length === 0)
        };

        /**
         * Проверит контейнер UI элементов на заполненность
         * @param container
         */
        this.checkUI = function (container, infoContext) {
            for (var property in container) {
                if (container.hasOwnProperty(property)) {
                    var val = container[property];
                    if (self.empty(val)) {
                        console.error('property "' + property + '" is empty', container, infoContext)
                    }
                }
            }
        };


        /**
         * Имя контекста в котром испольняется код
         * @param {*} context
         */
        this.getContextName = function (context) {
            var type = typeof context;
            if (type === "function") {
                var name = context.name
            } else {
                var name = context.constructor.name
            }

            return name;
        };

        /**
         * Получить html шаблон
         * @param {*} idTemplate
         */
        this.getTemplate = function (idTemplate) {
            if (typeof idTemplate === "string") {
                return $($('#' + idTemplate).html())
            } else {
                return $(idTemplate.html())
            }
        };

        /**
         * Вернет компонент созданный на DOM элементе
         * @param DOM
         * @param ClassComponent
         * @returns {*}
         */
        this.singleComponent = function (DOM, ClassComponent) {
            var root = $(DOM);

            if (self.empty(root)) {
                console.error('not found DOM ', DOM, ClassComponent);
                return;
            }

            var nameComponent = self.getContextName(ClassComponent);
            var component = root.data(nameComponent);

            if (typeof component === "undefined") {
                root.attr('data-controller', nameComponent);
                root.data('controller', nameComponent);

                component = new ClassComponent(root);
                root.data(nameComponent, component);
            }

            return component
        };

        /**
         * Ищем объект в DOM дереве и назначаем на него компонент
         * @param select
         * @param ClassComponent
         * @param maybeEmpty
         */
        this.initSingleComponent = function (select, ClassComponent, maybeEmpty) {
            var nameComponent = self.getContextName(ClassComponent);
            select = typeof select == "undefined" ? '[data-controller="' + nameComponent + '"]' : select;
            var lst = $(select);
            for (var i = 0, len = lst.length; i < len; i++) {
                self.singleComponent(lst[i], ClassComponent)
            }

            if (lst.length === 0 && !maybeEmpty) {
                console.error('initSingleComponent: not found', select);
            }

            return result;
        };

        /**
         * Удаляет на el класс css если верно уловие condition
         * @param {*} el 
         * @param string cssClass 
         * @param boolean condition 
         */
        this.toggleCssClass = function (el, cssClass, condition) {
            if (condition) {
                $(el).addClass(cssClass);
            } else {
                $(el).removeClass(cssClass)
            }
        };

        /**
         * Показывает элемент el если истина условие condition или прячет элемент
         * @param {*} el 
         * @param boolean condition 
         */
        this.toggleShow = function (el, condition) {
            if (condition) {
                $(el).show();
            } else {
                $(el).hide();
            }
        };


        /**
         * Проверяет менет ли данные клавиша
         * @param keyCode
         * @returns {boolean}
         */
        this.isKeyCodeChar = function (keyCode) {
            return [16, 17, 18, 27, 37, 38, 39, 40].indexOf(keyCode) === -1
        };

        /**
         * При изменение данных
         * @param el
         * @param funChange
         */
        this.onChangeData = function (el, funChange) {
            if (el.is(':checkbox') || el.is(':radio')) {
                el.on('change', funChange);
            } else
                if (el.is('input') || el.is('textarea')) {
                    el.on('keyup', function (event) {
                        if (self.isKeyCodeChar(event.keyCode)) {
                            funChange(event)
                        }
                    });
                } else {
                    el.on('change', funChange);
                }
        };


        /**
 * Получить значение из radiobox
 * @param el
 * @returns {*}
 */
        this.getRadioValue = function (el) {
            return el.find('input:checked').prop('value');
        };

        /**
         * Установить значение для radiobox
         * @param el
         * @param val
         */
        this.setRadioValue = function (el, val) {
            el.find('input[value="' + val + '"]').prop('checked', true);
        };

        /**
         * Получить значение из чебокксов
         * @param el
         * @returns {Array}
         */
        this.getCheckboxValue = function (el) {
            var result = [];
            var items = el.find('input:checked');

            for (var i = 0, len = items.length; i < len; i += 1) {
                result.push($(items[i]).prop('value'));
            }

            return result;
        };

        this.setCheckboxValue = function (el, val) {
            var items = val;

            if (!helperJQ.isArray(val)) {
                items = [val];
            }

            for (var i = 0, len = items.length; i < len; i += 1) {
                el.find('input[value="' + items[i] + '"]').prop('checked', true);
            }
        };

        /**
         * Установить значение value на элементе el по источнику sourceData
         */
        function _setValBySource(el, value, sourceData) {
            if (sourceData === 'radio') {
                self.setRadioValue(el, value);
            } else if (sourceData === 'checkbox') {
                self.setCheckboxValue(el, value);
            } else {
                var setFunction = 'set' + sourceData;
                var contextObject = el.data('context-object');

                if (typeof contextObject[setFunction] !== "function") {
                    console.error('not fount function ' + setFunction, contextObject)
                } else {
                    contextObject[setFunction].apply(contextObject, [el, value]);
                }
            }
        }

        /**
         * Получить значение из элемента el по источнику sourceData 
         */
        function _getValBySource(el, sourceData) {
            if (sourceData === 'radio') {
                return self.getRadioValue(el);
            } else if (sourceData === 'checkbox') {
                return self.getCheckboxValue(el);
            } else {
                var getFunction = 'get' + sourceData;
                var contextObject = el.data('context-object');

                if (typeof contextObject[getFunction] !== "function") {
                    console.error('not fount function ' + getFunction, contextObject)
                } else {
                    return contextObject[getFunction].apply(contextObject, [el]);
                }
            }
        }

        /**
         * Установить значение на элементе
         * @param el
         * @param value
         * @param elementHtml Обратится как к элементу html. Не обязательный параметр
         */
        this.setVal = function (el, value, elementHtml) {
            if (!el || !el.length) {
                return;
            }

            var sourceData = el.data('ui-source');

            if (!elementHtml && sourceData) {
                _setValBySource(el, value, sourceData);

            } else if (el.is(':checkbox') || el.is(':radio')) {

                if (typeof value === "boolean") {
                    el.prop('checked', value);
                } else {
                    var test = el.val();
                    el.prop('checked', value === test);
                }

            } else if (el[0].value !== undefined) {
                el.val(value);
            } else {
                el.html(value);
            }
        };

        /**
         * Получить значение на элементе
         * @param el
         * @param elementHtml Обратится как к элементу html. Не обязательный параметр
         */
        this.getVal = function (el, elementHtml) {
            if (!el || !el.length) {
                return;
            }

            // Просто объект
            if (self.isObject(el) && !self.isObjectJQuery(el)) {
                ;
                var result = {};
                for (var key in el) {
                    result[key] = self.getVal(el[key], elementHtml);
                }
                return result;
            }

            var sourceData = el.data('ui-source');

            if (!elementHtml && sourceData) {
                return _getValBySource(el, sourceData);
            } else if (el[0].value !== undefined) {
                return el.val();
            } else {
                return el.html();
            }
        };

        /**
        * Это объект
        * @param obj
        * @returns {boolean}
        */
        this.isObject = function (obj) {
            return obj && Object.prototype.toString.call(obj) === "[object Object]"
        };

        /**
         * Это jquery элемент
         * @param obj
         * @returns {boolean}
         */
        this.isObjectJQuery = function (obj) {
            return self.isObject(obj) && obj instanceof jQuery
        };

        /**
         * Это массив
         * @param obj
         * @returns {boolean}
         */
        this.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]'
        };


        this.linkDataUI = function (data, uiList, eventProcess) {

            function getProcessChange(iEl, iKey) {
                var key = iKey;
                var el = iEl;
                return function () {
                    data[key] = self.getVal(el);
                    if (typeof eventProcess === "function") {
                        eventProcess.apply(self, [key]);
                    }
                };
            }

            for (var key in data) {

                var el = uiList[key];
                if (!el) {
                    continue;
                }

                self.setVal(el, data[key]);

                if (eventProcess) {
                    self.onChangeData(el, getProcessChange(el, key))
                }
            }
        };

    };

    window.helperJQ = new ClassHelperJQ();
})(window);