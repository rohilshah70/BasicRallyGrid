Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
   

    launch: function(){
		console.log("First app");

		this.pulldownContainer = Ext.create('Ext.container.Container', {

			layout: {
				type: 'hbox',
				align: 'stretch'
			}
		});

		this.add(this.pulldownContainer);
		//this._loadData();
		this._loadIterations();
    },


    //Load Iteration
    _loadIterations: function(){
    	this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
    		FieldLabel: 'Iteration',
    		labelAlign: 'right', 
    		width: 350,
    		listeners: {
    			ready: function(combobox){
    				//this._loadData();
    				this._loadSeverity();
    			},
    			select: function(combobox, records){
    				this._loadData();
    			},
    			scope: this
    		}
    	});

    	this.pulldownContainer.add(this.iterComboBox);
    },

_loadSeverity: function(){
    	this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
    		model: 'Defect',
    		field: 'Severity',
    		fieldLabel: 'Severity',
    		labelAlign: 'right',
    		listeners: {
    			ready: function(combobox){
    				this._loadData();
    			},
    			select: function(combobox, records){
    				this._loadData();
    			},
    			scope: this
    		}
    	});

    	this.pulldownContainer.add(this.severityComboBox);
    },

    //Get Data from rally
    _loadData: function(){

    	var selectedIterRef = this.iterComboBox.getRecord().get("_ref");
    	var severityValue = this.severityComboBox.getRecord().get("value");

var myFilters =[
        {
            property: 'Iteration',
            operation: '=',
            value: selectedIterRef
        },
        {
            property: 'Severity',
            operation: '=',
            value: severityValue
        },
    ];
    	

    //if store exist, just load new data
    if(this.defaultStore){

    	this.defaultStore.setFilter(myFilters);
    	this.defaultStore.load();
    }
    else{
    //create store
    this.defaultStore = Ext.create('Rally.data.wsapi.Store', {
    model: 'Defect',
    autoLoad: true,
    filters: myFilters,
    listeners: {
        load: function(myStore, myData, success) {
        console.log("got data!!", myStore, myData, success);
        if(!this.myGrid)
        this._createGrid(myStore);
	
        },
        scope: this
    },
    fetch: ['FormattedID','Name', 'Severity', 'Iteration', 'State']
});
}
    },


    //Create and show Grid of given stories
    _createGrid: function(myStoryStore){
    		this.myGrid = Ext.create('Rally.ui.grid.Grid', {
			store: myStoryStore,
 			columnCfgs: [
             'FormattedID', 'Name','State', 'Iteration'
             ]
			});

		this.add(this.myGrid);
    }


});
