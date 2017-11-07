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
                observer: 'setCustomEntityProperties'
            },
            fieldName:
            {
                type: String,
                observer: 'setCustomEntityProperties'
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
            },
            readonly:
            {
                type: Boolean,
                value: false
            },
            isReady:
            {
                type: Boolean
            }
        },

        ready: function () {
            this.isReady = true;
        },

        onValueChanged: function (newValue, oldValue) {
            if (this.isReady) {
                if (newValue == "")
                    this.formattedValue = "";
                else
                    this.formattedValue = moment('2017-01-01').add(moment.duration(this.value)).format("HH:mm:ss");
            }
        },

        onFormattedValueChanged: function (newValue, oldValue) {
            if (this.isReady && oldValue)
            {
                if (newValue.length == 0) {
                    this.value = "";
                    this.notifyValueChanged();
                }
                else if (newValue.length == 8) {
                    this.value = moment.duration(newValue).toISOString();
                    this.notifyValueChanged();
                }
            }
        },

        setCustomEntityProperties: function () {
            if (this.entity && this.fieldName) {
                if (this.entity.type == 'customEntity') {
                    var defs = ForgeWebComponents.Config["deltatre.forge.wcm"].CustomEntitiesConfiguration.Definitions;
                    var i;
                    for (i = 0; i < defs.length; i++) {
                        var def = defs[i];
                        if (def.Code == this.entity.entityCode) {
                            var p = def.JsonSchema.properties[this.fieldName];
                            this.title = p.title;
                            this.description = p.description;
                            this.readonly = p.readonly;
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
        }
    });
})();