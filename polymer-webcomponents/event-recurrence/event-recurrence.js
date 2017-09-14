(function () {

    var _recurrenceEnabled = false;
    var _checkboxInitlist = [];

    function Recurrence() {
        this.period = null;
        this.days = [];
    }

    function RecurrenceTypeList() {
        this.recurrenceTypeList = [];

        this.recurrenceTypeList.push({ "value": "no-recurrence", "label": "no recurrence" });
        this.recurrenceTypeList.push({ "value": "every-week", "label": "Every week" });
        this.recurrenceTypeList.push({ "value": "every-2-weeks", "label": "Every 2 weeks" });
        this.recurrenceTypeList.push({ "value": "every-3-weeks", "label": "Every 3 weeks" });
        this.recurrenceTypeList.push({ "value": "every-4-weeks", "label": "Every 4 weeks" });
    }

    Polymer({
        is: "event-recurrence",
        properties: {
            value: {
                type: Object,
                value: new Recurrence(),
                observer: '_valueChanged'
            },
            recurrenceTypes: {
                type: Object,
                value: new RecurrenceTypeList()
            }
        },

        ready: function () {
            _recurrenceEnabled = false;
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) {
                this.value = new Recurrence();
            }
            if (typeof newValue === "object" && typeof oldValue === "string") {
                var recurrenceType = this.value.period;
                if (recurrenceType != "no-recurrence" && recurrenceType != null) {
                    this._recurrenceEnabled = true;
                }
                else {
                    this._recurrenceEnabled = false;
                }
            }
        },

        _recurrenceTypeSelected: function (e) {
            var recurrenceType = e.target.recurrenceTypeValue;
            if (recurrenceType != "no-recurrence") {
                this._recurrenceEnabled = true;
            }
            else {
                this._recurrenceEnabled = false;
                for(var d = 0; d < this.value.days.length; d++)
                {
                    var chkBox = this.$$('#' + this.value.days[d]);
                    chkBox.checked = false;
                }
                this.value.days = [];
            }
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _dayCheckChanged: function (e) {
            var day = e.target.value;
            if (day != null) {
                if (e.target.checked) {
                    this.value.days.push(day);
                }
                else {
                    var index = this.value.days.indexOf(day);
                    this.value.days.splice(index, 1);
                }
                this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
            } else {
                var id = e.target.id;
                if (this.value.days.includes(id)) {
                    e.target.checked = true;
                }
            }
            console.log("_dayCheckChanged ");
            console.log(day);
            console.log(e);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
            console.log(this.value);
        }
    });

})();