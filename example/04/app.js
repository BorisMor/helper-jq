(function(window) {
    'use strict';

    function Application(DOM) {
        var self = this;

        // Элементы HTML
        this.ui = {
            root: $(DOM),
            input1: undefined,
            input2: undefined,
            input3: undefined,
            checkboxValue: undefined,
            radioValue: undefined,
            selectValue: undefined,
            selectMultiValue: undefined,

            outJson: undefined,
        };

        // данные
        this.data = {
            input1: 'Текст для поля # 1',
            input2: 'Текст для поля # 2',
            input3: 3.28084, // 1 метр в футах
            radioValue: 2,
            checkboxValue: [1,2],
            selectValue: 3,
            selectMultiValue: [1,3]
        };

        // Установка значения в элемент input3
        this.setInput3 = function(el, value) {
            var val = value / 3.28084; // выводим значение на элемент в метрах
            window.helperJQ.setVal(el, val, true);
        }

        // получить зчнаение из элемента
        this.getInput3 = function(el) {
            // Переводим значение футы    
            return 3.28084 * window.helperJQ.getVal(el, true);
        }


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