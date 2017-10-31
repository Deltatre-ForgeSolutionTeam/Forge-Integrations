(function () {
    Polymer({
        is: "duration-input",
        properties:
        {
            value:
            {
                type: String,
                value: "",
            },
            formattedValue: {
                type: String,
                value: "",
                observer: 'onFormattedValueChanged'
            }
        },

        ready: function()
        {
            this.formattedValue = moment('2017-01-01').add(moment.duration(this.value)).format("HH:mm:ss");
        },

        onFormattedValueChanged: function (newValue, oldValue)
        {
            if (oldValue != null && newValue != oldValue)
            {
                this.value = moment.duration(newValue).toISOString();
                this.fire('valueChanged', this.value);
            }
        }        
    });
})();