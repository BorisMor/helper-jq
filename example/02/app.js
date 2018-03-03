(function(window) {
    'use strict';

    /**
     * Элемент комментария
     * @param {*} DOM 
     */
    function ComponentComment(DOM) {
        var self = this;

        // Элементы в HTML
        this.ui = {
            root: $(DOM),
            text: undefined
        };

        this.delComment = function(event) {
            self.ui.root.remove()
        }

        this.init = function() {
            window.helperJQ.standardConnection(self, self.ui.root, self.ui);
        };

        self.init();
    }

    function Application(DOM) {
        var self = this;

        // Элементы в HTML
        this.ui = {
            root: $(DOM),
            edText: undefined,
            listComment: undefined
        };

        this.addComment = function(event) {
            var text = self.ui.edText.val();
            if (text.trim().length == 0) {
                alert('enter comment');
                self.ui.edText.focus();
                return;
            }

            var elHtml = helperJQ.getTemplate('template-show-comment').appendTo(self.ui.listComment);
            var comment = new ComponentComment(elHtml);
            comment.ui.text.html(text);
        };

        this.init = function() {
            window.helperJQ.standardConnection(self, self.ui, self.ui.root);
        };

        self.init();
    }

    var app = new Application('#app');
})(window);