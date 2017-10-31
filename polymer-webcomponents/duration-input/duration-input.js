(function () {
    Polymer({
        is: "duration-input",
        properties:
        {
            value:
            {
                type: String,
                value: "",
                observer: 'onValueChanged'
            },
            formattedValue: {
                type: String,
                value: "",
                observer: 'onFormattedValueChanged'
            }
        },

        onValueChanged: function (newValue, oldValue)
        {
            if (newValue)
                this.formattedValue = moment('2017-01-01').add(moment.duration(this.value)).format("HH:mm:ss");
            else
                this.formattedValue = null;
        },

        onFormattedValueChanged: function (newValue, oldValue)
        {
            if (oldValue != null && newValue != oldValue)
            {
                var v = moment.duration(newValue).toISOString();
                this.fire('valueChanged', v);
            }
        }        
    });
})();