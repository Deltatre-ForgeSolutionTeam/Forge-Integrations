(function () {

    Polymer({
        is: "story-part-quote",
        properties: {
            value: {
                type: Object,
                value: {},
                observer: '_valueChanged'
            }
        },

        ready: function () {
            
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) {
                this.value = {};
            }
        }
    });
})();