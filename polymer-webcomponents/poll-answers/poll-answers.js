(function () {
    
        const answerType = "text";
    
        function Answer(answerType){
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
                }
    
            },
    
            ready: function () {
                this._linkToContentType = false;
                this._externalLinkType = false;
            },
    
            _valueChanged: function (newValue, oldValue) {
                if (!newValue) this.value =  [];
            },
    
            _addAnswer: function(e, answer){
                var path = "value";
                var positionLength = this.value.length;
    
                if(positionLength == 0){
                    this.push(path, new Answer(answerType));
                    this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
                }else{
                    if(this.value[positionLength - 1]){
    
                    var lastPositionInsert = this.value[positionLength - 1];
                        if(lastPositionInsert.content){
                        this.push(path, new Answer(answerType));
                        this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
                        }else{
                            toastWarningPoll.open();
                            return;
                        }           
                    }
                }       
            },
    
            _onAnswerInput: function(){
                this.debounce('triggerOnValueChanged', this._triggerValueChanged, 500);
            },
    
            _onAnswerChange: function(){
                this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            },
    
            _deleteAnswer: function(e){
                var path = "value";
                var _index = e.model.dataHost.answerIndex;
                this.splice(path, _index, 1);
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