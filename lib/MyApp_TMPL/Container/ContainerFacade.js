
// ContainerFacade

// idioms:
//     
//     // specify multi segment
//     var ContainerFactory = MyApp.getContainerFactory();
//     var container = ContainerFactory.getContainer('SegmentA','SegmentB');
//     
//     // connect to all segment
//     container.connect();
//     
//     // at the first of your session
//     container.init();
//     
//     // method call for transaction object
//     // will propagete same method call in the facade.
//     var tx = container.getTransaction();
//     tx.begin();
//     tx.setAutoCommit();
//     tx.isolationLebelSerializable();
//     
//     # manage entity
//     instance.setFoo(bar);
//     
//     // same propagetion
//     tx.commit();
//     tx.rollback();
//     tx.close();
//     
//     // before you exit your session
//     container.drain();
//     
//     

var TransactionFacade = require('./TransactionFacade');

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function ContainerFacadeConstructor(containers){
	// instance variables
	this.containers = containers;
	
	// explicit representation of transaction
	this.transactionFacade = new TransactionFacade(this.containers);
}

module.exports = ContainerFacadeConstructor;

var ContainerFacade = ContainerFacadeConstructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// transaction services

ContainerFacade.getTransaction = function(){
	return this.transactionFacade;
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// general services

ContainerFacade.init = function(){
	this.containers.map( function(container){ container.init(); } );
};

ContainerFacade.drain = function(){
	this.containers.map( function(container){ container.drain(); } );
};

// public api for backend connection

ContainerFacade.connect = function(){
	this.containers.map( function(container){ container.connect(); } );
};

ContainerFacade.disconnect = function(){
	this.containers.map( function(container){ container.disconnect(); } );
};


