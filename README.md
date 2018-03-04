# HelperJQ

Цель данного хэлпера для jQuery: разделение js и верстки.
С помощью data атрибутов мы передаем в js код необходимую информацию

**data-handler** - функция в js объекте для обработки события <br />
**data-action** - событие при котом срабатывает _data-handler_. По умолчанию click<br />
**data-ui** - имя переменной в js объекте с которым связывается DOM элемент.<br />
**data-ui-context** - функция в js объекте которая собирает DOM элементы _(см. пример example/03)_<br />
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