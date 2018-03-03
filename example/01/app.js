(function(window) {
    'use strict';

    function Application(DOM) {
        var self = this;

        // Элементы в HTML
        this.ui = {
            root: $(DOM),
            title: undefined,
            newText: undefined,
            fastTitle: undefined,
            newFastTitle: undefined,

            alert: {
                wrap: undefined,
                message: undefined
            }
        }

        this.setChengeText = function(event) {
            self.ui.alert.wrap.hide();

            var newText = self.ui.newText.val();

            if (!newText.length) {
                self.ui.alert.wrap.show();
                self.ui.alert.message.text("enter new text");
            } else {
                self.ui.title.text(newText);
            }
        }

        this.setFastTitle = function(event) {
            var txt = self.ui.newFastTitle.val();
            self.ui.fastTitle.text(txt);
        }

        this.init = function() {
            window.helperJQ.standardConnection(self, self.ui, self.ui.root);
        }

        self.init();
    }

    var app = new Application('#app');
})(window)