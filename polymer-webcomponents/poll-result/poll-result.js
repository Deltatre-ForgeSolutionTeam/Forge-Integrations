(function () {

    var oldPollEntityId = null;

    Polymer({
        is: "poll-result",
        behaviors: [
            ForgeWebComponents.Behaviors.ForgeLocalizeBehavior
        ],
        properties: {
            value: {
                type: Object,
                value: { },
                observer: '_valueChanged'
            },

            moduleEnabled: {
                type: Boolean,
                value: false
            },
            pollResult: {
                type: Array,
                value: [ ]
            }
        },

        ready: function () {
            this._pollResultLoad();
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value =  [];
        },

        _pollResultLoad: function() {
            this.$.requestPollResult.generateRequest();
        },

        _pollResultResponse: function(data) {
            this.pollResult = data.detail.response.pollResult;

            if (this.pollResult.length > 0)
                this.moduleEnabled = true;
            else
                this.moduleEnabled = false;
        }
    });


})();