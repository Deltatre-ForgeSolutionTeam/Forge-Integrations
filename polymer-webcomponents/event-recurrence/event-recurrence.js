(function(){

    var _recurrenceSwitchEnabled = false;

    function Recurrence(){
        this.period = null;
        this.days = [];
    }

    Polymer({
        is: "event-recurrence",
        properties: {
            value: {
                type: Object,
                value: new Recurrence(),
                observer: '_valueChanged'
            }
        },

        ready: function () {
            
        },

        _valueChanged: function (newValue, oldValue) {
            if (!newValue) this.value = new Recurrence();
        },

        _recurrenceSwitchChanged: function (e){
            //check se value è valorizzato e metterlo a true
            
            if(e.target.checked){
                this._recurrenceSwitchEnabled = true;
            }else{
                this._recurrenceSwitchEnabled = false;
            }
                //svuotare oggetto prima di lanciare l'evento

            console.log("change");
        },

        _triggerValueChanged: function () {
            this.fire('valueChanged', this.value);
            console.log(this.value);
        }
    });

})();