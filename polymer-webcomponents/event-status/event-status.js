(function () {    
        function EventStatus() {
            this.online = true;
            this.type = null;
        }
    
        function EventTypes() {
            this.eventTypesList = [];
    
            this.eventTypesList.push({ "value": "live", "label": "Live" });
            this.eventTypesList.push({ "value": "replay", "label": "Replay" });
        }
    
        Polymer({
            is: "event-status",
            properties: {
                value: {
                    type: Object,
                    value: new EventStatus(),
                    observer: '_valueChanged'
                },
                eventTypes: {
                    type: Object,
                    value: new EventTypes()
                }
            },
    
            ready: function () {
    
            },
    
            _valueChanged: function (newValue, oldValue) {
                if (!newValue) {
                    this.value = new EventStatus();
                }
            },
    
            _eventTypeSelected: function (e) {
                var eventType = e.target.eventTypeValue;
                
                this.value.type = eventType;
    
                this._notifyValueChanged();
            },

            _onlineChanged: function (e) {
                this.value.online = e.target.checked;

                if (!this.value.online) {
                    this.value.type = null;
                }

                this._notifyValueChanged();
            },
    
            _deleteEventType: function() {
                var lsbEventTypes = this.$$("#lsbEventTypes");
                
                if (lsbEventTypes != null) {
                    lsbEventTypes.selected = null;
                    
                    this._clearValue();
                    this._notifyValueChanged();
                }
            },
    
            _clearValue: function () {
                this.value.online = true;
                this.value.type = null;
            },
    
            _notifyValueChanged: function () {
                this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            },
    
            _triggerValueChanged: function () {
                this.fire('valueChanged', this.value);
            }
        });
    })();