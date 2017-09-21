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
            },
            pollResult: {
                type:Object,
                value: {}
            }
        },

        ready: function () {
            this._pollResultLoad();
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value =  [];
        },

        _pollResultLoad: function(){
            this.$.requestPollResult.generateRequest();
        },


        _pollResultResponse: function(data){
            console.log(data.detail.response);
            this.pollResult = data.detail.response;
        }

    });


})();