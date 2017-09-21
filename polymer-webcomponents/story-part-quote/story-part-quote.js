(function () {

    function QuoteData() {
        this.quote = null;
        this.author = null;
    }

    Polymer({
        is: "story-part-quote",
        properties: {
            value: {
                type: Object,
                value: new QuoteData(),
                observer: '_valueChanged'
            }
        },

        ready: function () {
            
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) {
                this.value = new QuoteData();
            }
        },

        _quoteInput: function(e){
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 2000);
        },
        _quoteChanged: function(e){
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _authorInput: function(e){
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 2000);
        },
        _authorChanged: function(e){
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
            console.log(this.value);
        }
    });
})();