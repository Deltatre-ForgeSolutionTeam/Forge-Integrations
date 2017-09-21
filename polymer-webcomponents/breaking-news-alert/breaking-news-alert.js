(function () {

    var _alertEnabled = false;

    function BreakingNewsAlert() {
        this.enabled = false;
        this.type = null;
        this.url = null;
    }

    function BreakingNewsAlertTypes() {
        this.alertTypesList = [];

        this.alertTypesList.push({ "value": "homepage", "label": "Home Page" });
        this.alertTypesList.push({ "value": "site-wide", "label": "Site Wide" });
    }

    Polymer({
        is: "breaking-news-alert",
        properties: {
            value: {
                type: Object,
                value: new BreakingNewsAlert(),
                observer: '_valueChanged'
            },
            alertTypes: {
                type: Object,
                value: new BreakingNewsAlertTypes()
            }
        },

        ready: function () {

        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) {
                this.value = new BreakingNewsAlert();
            }

            if (this.value.type != "" &&
                this.value.type != null) {
                    this._alertEnabled = true;
                }
            else {
                this._alertEnabled = false;
            }
        },

        _alertTypeSelected: function (e) {
            var alertType = e.target.alertTypeValue;

            if (alertType != "" &&
                alertType != null) {
                this.value.enabled = true;
                this.value.type = alertType;

                this._alertEnabled = true;
            }
            else {
                this._clearValue();
            }

            this._notifyValueChanged();
        },

        _urlChanged: function (e) {
            var url = e.target.value;

            if (url == "") {
                url = null;
            }

            this.value.url = url;

            this._notifyValueChanged();
        },

        _deleteAlertType: function() {
            var lsbAlertTypes = this.$$("#lsbAlertTypes");
            
            if (lsbAlertTypes != null) {
                lsbAlertTypes.selected = null;
                
                this._clearValue();
                this._notifyValueChanged();
            }
        },

        _clearValue: function () {
            this.value.enabled = false;
            this.value.type = null;
            this.value.url = null;
            
            this._alertEnabled = false;
        },

        _notifyValueChanged: function () {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        }
    });
})();