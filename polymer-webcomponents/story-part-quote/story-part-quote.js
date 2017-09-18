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

        _quoteChanged: function(e){
            Console.log("quoteChanged: " + e);
        },

        _authorChanged: function(e){
            Console.log("authorChanged: " + e);
        }
    });
})();