(function () {
    Polymer({
        is: 'story-part-table',
        properties: {
            value: {
                type: Object,
                observer: '_valueChanged',
                value: { columns: [], rows: [] }
            },
            label: {
                type: String
            },
            fieldName: {
                type: String
            },
            entity: {
                type: Object
            },
            schema: {
                type: Object
            },
            disabled: {
                type: Boolean,
                value: false
            },
            canAddRow: {
                type: Boolean,
                computed: 'computeCanAddRow(value.columns.splices)'
            }
        },
        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = { columns: [], rows: [] };
        },
        triggerOnValueChanged: function () {
            if (this.disabled) return;
            this.fire('valueChanged', this.value);
        },
        onInput: function (e) {
            this.debounce('triggerOnValueChanged', this.triggerOnValueChanged, 2000);
        },
        onChange: function (e) {
            this.debounce('triggerOnValueChanged', this.triggerOnValueChanged, 0);
        },
        onItemChange: function (e) {

            const index = e.model.get('index');
            e.model.set('row.content.' + index, e.target.value);

            if (e.type === "change")
                this.onChange();
            else
                this.onInput();

        },
        arrayItem: function (row, index) {
            return row.content[index];
        },
        addRow: function (e) {
            var content = [];
            for (var i = 0; i < this.value.columns.length; i++) {
                content.push("");
            }
            this.push('value.rows', { "content": content });
            this.onChange();
        },
        deleteRow: function (e) {
            const index = e.model.get('index');
            this.splice('value.rows', index, 1);
            this.onChange();
        },
        addColumn: function () {
            this.push('value.columns', { "content": "" });
            this.onChange();
        },
        deleteColumn: function (e) {
            const index = e.model.get('index');
            this.splice('value.columns', index, 1);
            for (var i = 0; i < this.value.rows.length; i++) {
                var row = this.value.rows[i];
                if (row.content.length > index)
                    row.content.splice(index, 1);
            }

            var cols = this.get('value.columns');
            if (cols.length == 0) {
                var rows = this.get('value.rows');
                this.splice('value.rows', 0, rows.length);
            }
            this.onChange();
        },
        computeCanAddRow: function (splices) {
            return this.value.columns.length > 0;
        }
    });
})();