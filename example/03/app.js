(function(window) {
    'use strict';

    var Application = function(DOM){
        var self = this;

        // css класс активности
        var CSS_TAB_ACTIVE = 'active';

        // ID текущей активной закладки
        this.idActiveTab = undefined;

        this.ui = {
            root: $(DOM),
            labelActiveTab: undefined,
            tabs: {} // Список закладок
        };

        /**
         * Делаем активной закладку с определенным ID
         * @param {*} idTab 
         */
        this.selectTab = function(idTab){
            self.idActiveTab = idTab;

            for (var id in self.ui.tabs) {
                var tab = self.ui.tabs[id];
                if (id === idTab) {
                    tab.addClass(CSS_TAB_ACTIVE);                
                } else {
                    tab.removeClass(CSS_TAB_ACTIVE)
                }
            }

            self.onChangeTab();
        };

        /** 
        * Тут может быть любое действие на смену закладки
        */
        this.onChangeTab = function(){
            var tab = self.ui.tabs[self.idActiveTab];
            var text = tab.text().trim();
            self.ui.labelActiveTab.text(text);
        };

        /**
         * Добавление закладки
         * @param {*} tab 
         */
        this.addTab = function(tab) {
            var id = tab.attr('id');
            self.ui.tabs[id] = tab;

            if (tab.hasClass(CSS_TAB_ACTIVE)) {
                self.idActiveTab = id;
            }

            tab.find('a').on('click', function(event){
                event.preventDefault();
                self.selectTab(id);
            });
        };

        this.init = function() {
            window.helperJQ.standardConnection(self);
            self.onChangeTab();
        };

        this.init();
    }

    var app = new Application('#app')
})(window)