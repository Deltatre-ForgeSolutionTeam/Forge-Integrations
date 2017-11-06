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
            },
            entity:
            {
                type: Object,
                observer: 'setLabels'
            },
            fieldName:
            {
                type: String,
                observer: 'setLabels'
            },
            title:
            {
                type: String,
                value: "Duration"
            },
            description:
            {
                type: String,
                value: "Duration of the video (hh:mm:ss)."
            }
        },

        onValueChanged: function (newValue, oldValue) {
            if (newValue && newValue != null && newValue != "") {
                if (newValue != oldValue)
                    this.formattedValue = moment('2017-01-01').add(moment.duration(this.value)).format("HH:mm:ss");
            }
            else
                this.formattedValue = null;
        },

        onFormattedValueChanged: function (newValue, oldValue) {
            if (oldValue != null && newValue != oldValue) {
                if (!newValue || newValue.length == 0){
                    this.value = "";
                    this.notifyValueChanged();
                }
                else if (newValue.length == 8) {
                    this.value = moment.duration(newValue).toISOString();
                    this.notifyValueChanged();
                }
            }
        },

        setLabels: function()
        {
            if (this.entity && this.fieldName){
                if (this.entity.type == 'customEntity') {
                    var defs = ForgeWebComponents.Config["deltatre.forge.wcm"].CustomEntitiesConfiguration.Definitions;
                    var i;
                    for (i = 0; i < defs.length; i++) {
                        var def = defs[i];
                        if (def.Code == this.entity.entityCode) {
                            var p = def.JsonSchema.properties[this.fieldName];
                            this.title = p.title;
                            this.description = p.description;
                            break;
                        }
                    }
                }
            }
        },

        notifyValueChanged: function () {
            this.debounce('triggerOnValueChanged', this.triggerValueChanged, 0);
        },

        triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        }    });
})();