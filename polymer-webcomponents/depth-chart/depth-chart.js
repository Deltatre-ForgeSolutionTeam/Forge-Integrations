(function () {
    var needBind = true;

    const REFERENCE_FIELD_NAME = "depthChartPlayers";

    function DepthChartSection(name) {
        this.name = name || null; // string
        this.positions = []; // array<DepthChartPosition>
    }

    function DepthChartPosition(name, tiers) {
        this.name = name || null; //string
        this.tiers = tiers; // array<guid> - guid of the Player customentity
    }

    function DepthChartTier(name) {
        this.name = name || null;
        this.players = [];
    }

    function DepthChart() {
        this.sections = [];

        this.sections.push(new DepthChartSection("offense"));
        this.sections.push(new DepthChartSection("defense"));
        this.sections.push(new DepthChartSection("specialTeams"));
    }

    function ReferenceFieldItemsCommandBody(entityId, translationId, aggregateType, fieldName, refEntityId, refEntityType) {
        this.aggregateId = entityId;
        this.translationId = translationId;
        this.aggregateType = aggregateType;
        this.fieldName = fieldName;
        this.referencedItems = [
            {
                entityType: refEntityType,
                entityId: refEntityId
            }
        ];
    }

    function AddReferenceFieldItemsCommand(entity, player) {
        const entityType = player.EntityCode ? player.EntityType + "." + player.EntityCode : player.EntityType;

        this.commandName = "AddReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(entity.entityId, entity.id, entity.fullTypeName || entity.type, REFERENCE_FIELD_NAME, player.EntityId, entityType);
    }

    function RemoveReferenceFieldItemsCommand(entity, player) {
        this.commandName = "RemoveReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(entity.entityId, entity.id, entity.fullTypeName || entity.type, REFERENCE_FIELD_NAME, player.entityId, player.type);
    }

    function PlayerReference(entityId, translationId, title, type, stage, thumbnailUrl) {
        this.entityId = entityId;
        this.translationId = translationId;
        this.title = title;
        this.type = type;
        this.unpublished = stage === "unpublished";
        this.link = ForgeWebComponents.Helpers.EntityHelper.createLink(type, entityId, translationId);
        this.thumbnail = thumbnailUrl || ForgeWebComponents.Helpers.EntityHelper.createThumbnailUrl(type, translationId);
    }

    Polymer({
        is: "depth-chart",
        behaviors: [
            ForgeWebComponents.Behaviors.ForgeLocalizeBehavior
        ],
        properties: {
            value: {
                type: Object,
                value: new DepthChart(),
                observer: '_valueChanged'
            },
            label: {
                type: String
            },
            fieldName: {
                type: String
            },
            entity: {
                type: Object,
                observer: '_entityChanged'
            },
            schema: {
                type: Object
            },
            disabled: {
                type: Boolean,
                value: false
            },
            tiers: {
                type: Array,
                value: []
            },
            showTiersConfiguration: {
                type: Boolean,
                value: false
            }
        },

        ready: function () {
            this._currentSectionIndex = null;
            this._currentPositionIndex = null;
            this._currentTierIndex = null;

            this.tiers = [];
            needBind = true;
        },

        _getPlayer: function (playerEntityId) {
            return this._players[playerEntityId];
        },

        _getPlayerLink: function (playerEntityId) {
            return this._getPlayer(playerEntityId).link;
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) {
                this.value = new DepthChart();
            }

            console.log("READY");

            if (needBind) {
                this._bindLocalTiers();
            }
        },

        _entityChanged: function (entity, oldValue) {
            if (!entity || typeof entity === 'string') return;

            const array = entity.referenceFields[REFERENCE_FIELD_NAME] || [];
            this._players = {};
            for (var i = 0; i < array.length; i++) {
                var player = array[i];
                this._players[player.entityId] = new PlayerReference(player.entityId, player.id, player.title, player.type, player.stage, player.thumbnailUrl);
            }
        },

        _onSectionInput: function () {
            this._callValueChanged(2000);
        },

        _onSectionChange: function () {
            this._callValueChanged(0);
        },

        _onPositionInput: function () {
            this._callValueChanged(2000);
        },
        _onPositionChange: function () {
            this._callValueChanged(0);
        },

        _addPosition: function (e) {
            var path = "value.sections." + e.model.sectionIndex + ".positions";
            var positionLength = this.value.sections[e.model.sectionIndex].positions.length;

            if (positionLength == 0) {
                this.push(path, new DepthChartPosition("", this._convertLocalTiersInObjects()));

                this._callValueChanged(0);
            } else {
                if (this.value.sections[e.model.sectionIndex].positions[positionLength - 1]) {
                    var lastPositionInsert = this.value.sections[e.model.sectionIndex].positions[positionLength - 1];

                    if (lastPositionInsert.name || lastPositionInsert.tiers.length > 0) {
                        this.push(path, new DepthChartPosition("", this._convertLocalTiersInObjects()));

                        this._callValueChanged(0);
                    } else {
                        toastWarningPostitionRow.open();
                        return;
                    }
                }
            }
        },

        _convertLocalTiersInObjects: function () {
            var retValue = [];

            for (var i = 0; i < this.tiers.length; i++) {
                retValue.push(new DepthChartTier(this.tiers[i]));
            }

            return retValue;
        },

        _deletePosition: function (e) {
            var path = "value.sections." + e.model.dataHost.sectionIndex + ".positions";
            this.splice(path, e.model.positionIndex, 1);

            this._callValueChanged(0);
        },

        _addPlayer: function (e) {
            this._currentSectionIndex = e.model.sectionIndex;
            this._currentPositionIndex = e.model.positionIndex;
            this._currentTierIndex = e.model.tierIndex;
            this.$.searchPlayers.open();

            this._callValueChanged(0);
        },

        _deletePlayer: function (e) {
            const path = "value.sections." + e.model.dataHost.sectionIndex + ".positions." + e.model.dataHost.positionIndex + ".tiers." + e.model.dataHost.tierIndex + ".players";
            const removed = this.splice(path, e.model.playerIndex, 1)[0];
            const player = this._players[removed];

            if (player && this._isPlayerAbsent(removed)) {
                const command = new RemoveReferenceFieldItemsCommand(this.entity, player, this.fieldName);
                this.fire('sendCommand', command);
            }

            this._callValueChanged(0);
        },

        _playerSelected: function (e) {
            const player = e.detail.player;

            const playerAlreadyInserted = this.value.sections[this._currentSectionIndex].positions[this._currentPositionIndex].tiers[this._currentTierIndex].players.indexOf(player.EntityId) > -1;

            if (playerAlreadyInserted) {
                toastWarningPlayerPosition.open();
                return;
            }

            var path = "value.sections." + this._currentSectionIndex + ".positions." + this._currentPositionIndex + ".tiers." + this._currentTierIndex + ".players";
            this.push(path, player.EntityId);

            const entityType = player.EntityCode ? player.EntityType + "." + player.EntityCode : player.EntityType;
            this._players[player.EntityId] = new PlayerReference(player.EntityId, player.Id, player.Title, entityType, player.Stage);

            this._currentSectionIndex = null;
            this._currentPositionIndex = null;
            this._currentTierIndex = null;

            const command = new AddReferenceFieldItemsCommand(this.entity, player, this.fieldName);
            this.fire('sendCommand', command);

            this._callValueChanged(0);
        },

        _sortChange: function (e) {
            this._callValueChanged(0);
        },

        _sortPositionChange: function (e) {
            this._callValueChanged(0);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        },

        _isPlayerAbsent: function (guid) {
            for (var sectionIndex = 0; sectionIndex < this.value.sections.length; sectionIndex++) {
                var section = this.value.sections[sectionIndex];
                for (var positionIndex = 0; positionIndex < section.positions.length; positionIndex++) {
                    var position = section.positions[positionIndex];
                    for (var tierIndex = 0; tierIndex < position.tiers.length; tierIndex++) {
                        var tier = position.tiers[tierIndex];

                        if (tier.players.indexOf(guid) > -1) {
                            return false;
                        }
                    }
                }
            }

            return true;
        },

        _showOrHideTiersConfiguration: function () {
            if (this.showTiersConfiguration)
                this.showTiersConfiguration = false;
            else
                this.showTiersConfiguration = true;
        },

        _addTier: function () {
            if (this.tiers == null)
                this.tiers = [];

            this.push("tiers", "");

            this._addTierInPositions("");

            this._callValueChanged(0);
        },

        _deleteTier: function (e) {
            if (this.tiers != null) {
                var index = e.model.tierIndex;

                this.splice("tiers", index, 1);

                this._deleteTierInPositions(index);

                this._callValueChanged(0);
            }
        },

        _onTierInput: function (e) {
            var index = e.model.tierIndex;
            var newData = e.target.value;

            var tempData = this.tiers;
            tempData[index] = newData;

            this.set("tiers", tempData);

            this._callValueChanged(0);

            this._updateTierInPositions(index, newData);
        },

        _bindLocalTiers: function () {
            // Bind the tiers based on the first position
            if (this.value.sections != null &&
                this.value.sections.length >= 1) {
                if (this.value.sections[0].positions != null &&
                    this.value.sections[0].positions.length >= 1) {
                    if (this.value.sections[0].positions[0].tiers != null &&
                        this.value.sections[0].positions[0].tiers.length >= 1) {
                        for (var i = 0; i < this.value.sections[0].positions[0].tiers.length; i++) {
                            var tierToAdd = this.value.sections[0].positions[0].tiers[i].name;

                            this.push("tiers", tierToAdd);

                            needBind = false;
                        }
                    }
                }
            }
        },

        _addTierInPositions: function (newData) {
            for (s = 0; s < this.value.sections.length; s++) {
                var section = this.value.sections[s];

                for (p = 0; p < section.positions.length; p++) {
                    var position = section.positions[p];

                    this.push("value.sections." + s + ".positions." + p + ".tiers", new DepthChartTier(newData));
                }
            }
        },

        _updateTierInPositions: function (index, newData) {
            for (s = 0; s < this.value.sections.length; s++) {
                var section = this.value.sections[s];

                for (p = 0; p < section.positions.length; p++) {
                    var position = section.positions[p];

                    var tempData = this.value.sections[s].positions[p].tiers;
                    tempData[index].name = newData;

                    this.set("value.sections." + s + ".positions." + p + ".tiers", tempData);
                }
            }
        },

        _deleteTierInPositions: function (index) {
            for (s = 0; s < this.value.sections.length; s++) {
                var section = this.value.sections[s];

                for (p = 0; p < section.positions.length; p++) {
                    var position = section.positions[p];

                    this.splice("value.sections." + s + ".positions." + p + ".tiers", index, 1);
                }
            }
        },

        _showOrHidePositionContent: function (e) {
            var id = e.currentTarget.getAttribute('ident');
            var status = e.currentTarget.icon;
            var collapse = this.$$('iron-collapse[ident="' + id + '"]');

            if (status === "expand-more")
                e.currentTarget.icon = "expand-less";
            else
                e.currentTarget.icon = "expand-more";

            collapse.toggle();
        },

        _callValueChanged: function (mills) {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, mills);
        }
    });
})();
