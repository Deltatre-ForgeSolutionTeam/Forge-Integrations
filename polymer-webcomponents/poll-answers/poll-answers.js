(function () {

    const answerType = "text";

    function Answer(answerType){
        this.type = answerType;
        this.content = null;
    };

    function  AnswerList(){
        this.answers = [];
    }

    Polymer({
        is: "poll-answers",
        behaviors: [
            ForgeWebComponents.Behaviors.ForgeLocalizeBehavior
        ],
        properties: {
            value: {
                type: Object,
                value: new AnswerList(),
                observer: '_valueChanged'
            }

        },

        ready: function () {
            this._linkToContentType = false;
            this._externalLinkType = false;
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value =  new AnswerList();
        },

        _addAnswer: function(e){
            var path = "value.answers";
            this.push(path, new Answer(answerType));
            
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _onAnswerInput: function(){
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 500);
        },

        _onAnswerChange: function(){
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _deleteAnswer: function(e){
            var path = "value.answers";
            this.splice(path, e.model.answerIndex, 1);
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);

        },

        _isTextAnswer: function(answer){
            return answer.type === "text" ? true : false;
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        }


    });



})();