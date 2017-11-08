(function () {

    const REFERENCE_FIELD_NAME = "gameSponsorReferenceImages";
    const REFERENCE_FIELD_TYPE = "customentity.game";

    function AccessibleLink() {
        this.displayText = null;
        this.accessibleText = null;
        this.url = null;
        this.openInNewTab = false;
    }

    function Sponsor() {
        this.name = null;
        this.image = null;
        this.link = new AccessibleLink();
    }

    function SponsorsList() {
        this.sponsors = [];
    }

    function ReferenceFieldItemsCommandBody(gameEntity, imageEntity) {
        this.aggregateId = gameEntity.entityId;
        this.translationId = gameEntity.id;
        this.aggregateType = REFERENCE_FIELD_TYPE;
        this.fieldName = REFERENCE_FIELD_NAME;
        this.referencedItems = [
            {
                entityType: imageEntity.entityType,
                entityId: imageEntity.entityId
            }
        ];
    }

    function AddReferenceFieldItemsCommand(gameEntity, imageEntity) {
        this.commandName = "AddReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(gameEntity, imageEntity);
    }

    function RemoveReferenceFieldItemsCommand(gameEntity, imageEntity) {
        this.commandName = "RemoveReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(gameEntity, imageEntity);
    }

    Polymer({
        is: "game-sponsors",
        properties: {
            value: {
                type: Object,
                value: new SponsorsList(),
                observer: '_valueChanged'
            },
            entity: {
                type: Object
            },
            _showAddButton: {
                type: Boolean,
                value: true
            }
        },

        ready: function () {

        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new SponsorsList();

            if (this.value != null &&
                this.value.sponsors != null &&
                this.value.sponsors.length >= 3)
                this._showAddButton = false;
        },

        _addSponsor: function () {
            this.value.sponsors.push(new Sponsor());

            this._callValueChanged();
        },

        _sponsorImagePicked: function (e) {
            var image = e.detail.image;
            var sponsorIndex = e.model.index;
            var sponsors = this.value.sponsors;

            // Add to reference field
            if (sponsors[sponsorIndex].image != null) {
                this._removeImageToReferenceField(sponsors[sponsorIndex].image);
            }

            this._addImageToReferenceField(image);

            // Save in data
            sponsors[sponsorIndex].image = image;

            // Call value changed
            this._callValueChanged();
        },

        _sponsorImageRemoved: function (e) {
            var image = e.detail.image;
            var sponsorIndex = e.model.index;
            var sponsors = this.value.sponsors;

            sponsors[sponsorIndex].image = null;

            this._removeImageToReferenceField(image);

            this._callValueChanged();
        },

        _addImageToReferenceField: function (image) {
            const command = new AddReferenceFieldItemsCommand(this.entity, image);
            this.fire('sendCommand', command);
        },

        _removeImageToReferenceField: function (image) {
            const command = new RemoveReferenceFieldItemsCommand(this.entity, image);
            this.fire('sendCommand', command);
        },

        _sponsorNameChanged: function () {
            this._callValueChanged();
        },

        _sponsorLinkChanged: function (e) {
            if (e.detail.link != null) {
                var link = e.detail.link;
                var sponsorIndex = e.model.index;

                this.value.sponsors[sponsorIndex].link = link;

                this._callValueChanged();
            }
        },

        _deleteSponsor: function (e) {
            var sponsorIndex = e.model.index;
            var sponsors = this.value.sponsors;
            var sponsorImage = sponsors[sponsorIndex].image

            if (sponsorImage != null)
                this._removeImageToReferenceField(sponsorImage);

            sponsors.splice(sponsorIndex, 1);

            this._callValueChanged();
        },

        _callValueChanged: function () {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, 0);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        }
    });
})();