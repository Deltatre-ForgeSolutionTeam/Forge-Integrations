(function () {

    const answerType = "text";

    function Answer(answerType) {
        this.type = answerType;
        this.content = null;
        this.id = uuid.v4()
    };

    Polymer({
        is: "poll-answers",
        behaviors: [
            ForgeWebComponents.Behaviors.ForgeLocalizeBehavior
        ],
        properties: {
            value: {
                type: Array,
                value: [],
                observer: '_valueChanged'
            },
            _showAddButton: {
                type: Boolean,
                value: true
            }
        },

        ready: function () {
            this._linkToContentType = false;
            this._externalLinkType = false;

        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = [];
        },

        _addAnswer: function (e, answer) {

            var path = "value";
            var positionLength = this.value.length;
            this._showAddButton = true;

            if (positionLength == 0) {
                this.push(path, new Answer(answerType));
                this._callValueChanged(0);
            }
            else {
              
                var lastPositionInsert = this.value[positionLength - 1];
        
                if (lastPositionInsert.content) {
                    this.push(path, new Answer(answerType));
                    this._callValueChanged(0);
                } else {
                    toastWarningPoll.open();
                    return;
                }       
            }
        },

        _onAnswerInput: function () {
            this._callValueChanged(500);
        },

        _onAnswerChange: function () {
            this._callValueChanged(0);
        },

        _deleteAnswer: function (e) {
            var path = "value";
            var _index = e.model.dataHost.answerIndex;

            this.splice(path, _index, 1);
            this._callValueChanged(0);
        },

        _isTextAnswer: function (answer, indexAnswer) {
            return answer.type === "text" ? true : false;
        },

        _callValueChanged: function (mills) {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, mills);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        }
    });
})();