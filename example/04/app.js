(function(window) {
    'use strict';

    function Application(DOM) {
        var self = this;

        // Элементы HTML
        this.ui = {
            root: $(DOM),
            input1: undefined,
            input2: undefined,
            outJson: undefined
        };

        // данные
        this.data = {
            input1: 'Текст для поля # 1',
            input2: 'Текст для поля # 2',
        };

        /**
         * При изменение данных
         * @param key поле
         */
        this.onChangeData = function (key) {
            window.helperJQ.setVal(
                self.ui.outJson,
                JSON.stringify(self.data)
            );
        };

        // Иницилизация
        this.init = function() {
            window.helperJQ.standardConnection(self);
            window.helperJQ.linkDataUI(self.data, self.ui, self.onChangeData);
            self.onChangeData();
        };

        self.init();
    }

    var app = new Application('#app');
})(window);