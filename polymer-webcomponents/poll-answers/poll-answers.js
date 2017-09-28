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
                document.querySelector('paper-button').hidden = false;
                //e.target.hidden = false;
            
                if(positionLength == 0){
                    this.push(path, new Answer(answerType));
                    this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
                   
                }else{
                    if(positionLength < 10)
                    {
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
                    }else{
                        //e.target.hidden = true;
                        document.querySelector('paper-button').hidden = true;
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
                console.log(document.querySelector('paper-button'));
                console.log(this.value.length);

                if(this.value.length < 10){
                    document.querySelector('paper-button').hidden = false;
                }
            },

           
    
            _isTextAnswer: function(answer){
                return answer.type === "text" ? true : false;
            },
    
            _triggerValueChanged: function () {
                this.fire('valueChanged', this.value);
            }
        });
    })();