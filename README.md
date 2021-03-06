# HelperJQ

Цель хэлпера для jQuery: разделение js и верстки.
С помощью data атрибутов мы передаем в js код необходимую информацию

**data-handler** - функция в js объекте для обработки события <br />
**data-action** - событие при котом срабатывает _data-handler_. По умолчанию click<br />
**data-ui** - имя переменной в js объекте с которым связывается DOM элемент.<br />
**data-ui-context** - функция в js объекте которая собирает DOM элементы _(см. пример example/03)_<br />
**data-ui-source** - Источник данных для элемента указанного в data-ui _(см. пример example/04)_<br />
**data-controller** - явно указывает объект который обрабатывает данный участок кода<br />

Методы:
----------

`window.helperJQ.standardConnection(context, containerUI, rootDOM)`<br />
Производит связывание объекта с DOM данными<br />
_context_ - констекст в котором выполняется собятия прописанные в data-handler<br />
_containerUI_ - объект в который складываются элементы указанные через data-ui<br />
_rootDOM_ - Корневой DOM элемент к которому привязывается контекст

_containerUI_ и _rootDOM_ необязательные параметры.<br />
Если они не указываются то считается что _containerUI_ = _context.ui_, а _rootDOM_ = _context.ui.root_

`window.helperJQ.linkDataUI(data, containerUI);`<br />
Перенести данные в интерфейс. По одноименным полям в data и containerUI 
_data_ - объект с данными
_containerUI_ - объект в который складываются элементы указанные через data-ui
_(см. пример example/04)_
<br />

`window.window.helperJQ.linkDataUI(data, containerUI, true);`<br />
Перенести данные в интерфейс и обновляет каждый раз при изменение элементов интерфейса

`window.helperJQ.linkDataUI(data, containerUI, function(key){
    console.log(key)
});`<br />
Перенести данные в интерфейс, обновляет каждый раз при изменение элементов интерфейса, вызывает колбэк с указанием поля которое изменилось


Простейший пример
----------
При нажатие на кнопку увеличивает счетчик нажатий.

Верстка:

```HTML
    <div id="app">
        <button name="test" data-handler="onClick">Нажми на меня</button>
        <span data-ui="label">Нажми на кнопку</span>
    </div>
```

JS код:

```js
(function(window) {
    'use strict';

    function Application(DOM) {
        var self = this;
        this.countClick = undefined;

        // Элементы HTML
        this.ui = {
            root: $(DOM),
            label: undefined
        }

        // Действо вызываемое из HTML
        this.onClick = function() {
            self.countClick++;
            self.ui.label.text("Количество кликов: " + self.countClick);
        };

        // Инициализация
        this.init = function() {
            window.helperJQ.standardConnection(self);
            self.countClick = 0;
        }

        self.init();
    }

    var app = new Application('#app');
})(window)
```