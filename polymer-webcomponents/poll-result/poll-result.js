(function () {
    
    Polymer({
        is: "poll-result",
        behaviors: [
            ForgeWebComponents.Behaviors.ForgeLocalizeBehavior
        ],
        properties: {
            value: {
                type: Object,
                value: {},
                observer: '_valueChanged'
            }
        },

        ready: function () {
            this._pollResultLoad();
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value =  [];
        },

        _pollResultLoad: function(){
            console.log("load result");
            this.$.requestPollResult.generateRequest();
        },


        _pollResultResponse: function(data){
            console.log(data.detail.response);

        }

    });


})();