(function () {

    Polymer({
        is: "story-part-html-not-supported",
        properties: {
            value: {
                type: Object,
                observer: '_valueChanged'
            }
        },

        ready: function () {
            
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) { }
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        }
    });
})();