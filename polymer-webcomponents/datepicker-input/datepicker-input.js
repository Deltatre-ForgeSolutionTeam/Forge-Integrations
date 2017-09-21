(function () {

    function createDateChangedEvent(date) {
        return new CustomEvent('date-changed', { detail: { date: date } });
    }

    Polymer({
        is: 'datepicker-input',
        properties: {
            value: {
                type: String,
                value: "",
                observer: '_valueChanged'
            },
            formattedValue: {
                type: String,
                computed: 'computeFormattedValue(value)'
            },
            listeners: {
                'dateChanged': 'testDateChanged'
            }
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) {
                this.value = "";
            }
            /*if (typeof newValue === "object" && typeof oldValue === "string") {
                var recurrenceType = this.value.period;
                if (recurrenceType != "no-recurrence" && recurrenceType != null) {
                    this._recurrenceEnabled = true;
                }
                else {
                    this._recurrenceEnabled = false;
                }
            }*/
        },

        openDatepicker: function() {
          this.$.datePicker.open();
        },

        computeFormattedValue: function(value) {
          if (!value) {
            return null;
          }
          return moment(value).format('LL');
        },

        _evalDate: function(value) {
          if (!value) {
            return new Date();
          }
          return moment(value).toDate();
        },

        deleteDate: function() {
          this.value = null;
          this.dispatchEvent(createDateChangedEvent(this.value));
        },

        onDatePickerClosed: function() {
          if (event.detail.confirmed) {
            var date = moment(this.$.picker.date);
            this.value = date.format('YYYY-MM-DD');
            this.dispatchEvent(createDateChangedEvent(this.value));
          }
        }    
    });

})();