# HelperJQ

Цель данного хэлпера для jQuery: разделение js и верстки.
----------
Пример: при нажатие на кнопку увеличивает счетчик нажатий.

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