(function () {

    const REFERENCE_FIELD_NAME = "injuryReportPlayers";
    const REFERENCE_FIELD_TYPE = "customentity.injuryreport";

    function ReferenceFieldItemsCommandBody(injuryReportEntity, referenceEntity) {
        this.aggregateId = injuryReportEntity.entityId;
        this.translationId = injuryReportEntity.id;
        this.aggregateType = REFERENCE_FIELD_TYPE;
        this.fieldName = REFERENCE_FIELD_NAME;

        this.referencedItems = [
            {
                entityType: "customentity.player",
                entityId: referenceEntity.EntityId
            }
        ];
    }

    function AddReferenceFieldItemsCommand(eventEntity, referenceEntity) {
        this.commandName = "AddReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(eventEntity, referenceEntity);
    }

    function RemoveReferenceFieldItemsCommand(eventEntity, referenceEntity) {
        this.commandName = "RemoveReferenceFieldItemsCommand";
        this.commandBody = new ReferenceFieldItemsCommandBody(eventEntity, referenceEntity);
    }

    var _first_loading = true;

    function InjuryReport() {
        this.playersList = [];
    }

    function InjuryDays() {
        this.days = [];
        this.days.push("Monday")
        this.days.push("Tuesday")
        this.days.push("Wednesday")
        this.days.push("Thursday")
        this.days.push("Friday")
        this.days.push("Saturday")
    }

    function InjuryDaysStatus() {
        this.status = [];

        this.status.push("Not Listed");
        this.status.push("Did Not Participate");
        this.status.push("Limited Participation");
        this.status.push("Full Participation");
    }

    function GameStatus() {
        this.status = [];
        this.status.push("NOT_LISTED");
        this.status.push("QUESTIONABLE");
        this.status.push("DOUBTFUL");
        this.status.push("OUT");
    }

    function Player(player) {
        this._entityId = player.EntityId;
        this.type = player.EntityType;
        this.entityCode = player.EntityCode;
        this.days = [];
        this.gameStatus = null;
        this.injuryDescription = null;
    };

    function PlayerDayReport(day, status) {
        this.day = day;
        this.status = status;
    }

    Polymer({
        is: "injury-report",
        properties: {
            value: {
                type: Object,
                value: new InjuryReport(),
                observer: '_valueChanged'
            },
            label: {
                type: String
            },
            fieldName: {
                type: String
            },
            schema: {
                type: Object
            },
            disabled: {
                type: Boolean,
                value: false
            },
            injuryDays: {
                type: Object,
                value: new InjuryDays()
            },
            injuryDaysStatus: {
                type: Object,
                value: new InjuryDaysStatus()
            },
            injuryGameStatus: {
                type: Object,
                value: new GameStatus()
            },
            entity: {
                type: Object
            }
        },

        ready: function () {
            
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new InjuryReport();
        },

        _addPlayer: function () {
            this.$.searchPlayers.open();

            this._callValueChanged(0);
        },

        _playerSelected: function (e) {
            var player = e.detail.player;

            var playerAlreadyInserted = this.value.playersList.find(function (pl) {
                if (pl.entityId === player.EntityId) {
                    return pl;
                }
            });

            if (playerAlreadyInserted)
                toastWarningPlayerInserted.open();
            else {
                var playerEntity = new Player(player);

                this.push("value.playersList", playerEntity);

                this._addPlayerToReferenceField(player);

                this._callValueChanged(0);
            }
        },

        _getDayValue: function (day, playerIndex) {
            var retValue = null;

            var insertedDay = this.value.playersList[playerIndex].days.find(function (d) {
                if (d.day === day) {
                    return d;
                }
            });

            if (insertedDay)
                retValue = insertedDay.status;

            return retValue;
        },

        _getStatusValue: function (playerIndex) {
            return this.value.playersList[playerIndex].gameStatus ? this.value.playersList[playerIndex].gameStatus : null;
        },

        _itemSelected: function (e) {
            var day = e.target.attributes.day.value;
            var playerIndex = e.model.dataHost.playerIndex;
            var status = e.target.value;
            var path = "value.playersList." + playerIndex + ".days";


            if (day === 'game-status') {
                this.value.playersList[playerIndex].gameStatus = status;
            } else {

                var insertedDay = this.value.playersList[playerIndex].days.find(function (d) {
                    if (d.day === day) {
                        return d;
                    }
                });

                if (insertedDay)
                    insertedDay.status = status;
                else {
                    var day = new PlayerDayReport(day, status);

                    this.push(path, day);
                }
            }

            this._callValueChanged(0);
        },

        _onInjuryDescriptionInput: function () {
            this._callValueChanged(0);
        },

        _onInjuryDescriptionChange: function () {
            this._callValueChanged(0);
        },

        _deletePlayer: function (e) {
            var playerIndex = e.model.playerIndex;

            var removedPlayer = this.splice("value.playersList", playerIndex, 1);

            if (removedPlayer[0] != null) {
                removedPlayer[0].EntityId = removedPlayer[0]._entityId;
                this._removePlayerToReferenceField(removedPlayer[0]);
            }

            this._callValueChanged(0);
        },

        _addPlayerToReferenceField: function (player) {
            const command = new AddReferenceFieldItemsCommand(this.entity, player);
            this.fire('sendCommand', command);
        },

        _removePlayerToReferenceField: function (player) {
            const command = new RemoveReferenceFieldItemsCommand(this.entity, player);
            this.fire('sendCommand', command);
        },

        _callValueChanged: function (mills) {
            this.debounce('triggerOnValueChanged', this._triggerValueChanged, mills);
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
        },

        _getPlayerEntity: function (entity, player) {
            var retValue = null;

            if (entity.referenceFields != null &&
                entity.referenceFields[REFERENCE_FIELD_NAME]) {
                for (var i = 0; i < entity.referenceFields[REFERENCE_FIELD_NAME].length; i++) {
                    var playerEntity = entity.referenceFields[REFERENCE_FIELD_NAME][i];

                    if (playerEntity.entityId == player._entityId)
                        retValue = playerEntity;
                }
            }

            return retValue;
        }
    });
})();