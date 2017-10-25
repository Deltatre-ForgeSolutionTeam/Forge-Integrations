(function () {



    Polymer({
        is: "shield-entity-mapping",
        properties: {
            entity: {
                type: Object,
                observer: '_entityChanged'
            }
        },

        _entityChanged: function(){
            console.log("_entityChanged");
            console.log(this.entity);
        }
    });
})();