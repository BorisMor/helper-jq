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

        // Иницилизация
        this.init = function() {
            window.helperJQ.standardConnection(self);
            self.countClick = 0;
        }

        self.init();
    }

    var app = new Application('#app');
})(window)