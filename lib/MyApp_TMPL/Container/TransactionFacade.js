
// TransactionFacade

// idioms:
//     
//     // specify multi segment
//     var ContainerFactory = MyApp.getContainerFactory();
//     var container = ContainerFactory.getContainer('SegmentA','SegmentB');
//     
//     // connect to all segment
//     container.connect();
//     
//     // method call for transaction object
//     // will propagate same method call in the facade.
//     var tx = container.getTransaction();
//     tx.begin();
//     tx.setAutoCommit();
//     tx.isolationLebelSerializable();
//     
//     # manage entity
//     instance.setFoo(bar);
//     
//     // same propagate
//     tx.commit();
//     tx.rollback();
//     tx.close();
//        

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function TransactionFacadeConstructor(containers){
	// instance variables
	this.transactions = [];
	
	for( var i=0; i<containers.length; i++ ){
		this.transactions.push( containers[i].getTransaction() );
	}
}

module.exports = TransactionFacadeConstructor;

var TransactionFacade = TransactionFacadeConstructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

TransactionFacade.begin = function(){
	this.transactions.map( function(transaction){ transaction.begin(); } );
};

TransactionFacade.setAutoCommit = function(){
	this.transactions.map( function(transaction){ transaction.setAutoCommit(); } );
};

TransactionFacade.isolationLevel = function(level){
	this.transactions.map( function(transaction){ transaction.isolationLevel(level); } );
};

TransactionFacade.isolationLebelSerializable = function(){
	this.transactions.map( function(transaction){ transaction.isolationLebelSerializable(); } );
};

TransactionFacade.isolationLebelRepeatableRead = function(){
	this.transactions.map( function(transaction){ transaction.isolationLebelRepeatableRead(); } );
};

TransactionFacade.isolationLebelReadCommited = function(){
	this.transactions.map( function(transaction){ transaction.isolationLebelReadCommited(); } );
};

TransactionFacade.forceCommit = function(){
	this.transactions.map( function(transaction){ transaction.forceCommit(); } );
};

TransactionFacade.commit = function(){
	this.transactions.map( function(transaction){ transaction.commit(); } );
};

TransactionFacade.forceRollback = function(){
	this.transactions.map( function(transaction){ transaction.forceRollback(); } );
};

TransactionFacade.rollback = function(){
	this.transactions.map( function(transaction){ transaction.rollback(); } );
};

TransactionFacade.abort = function(){
	this.transactions.map( function(transaction){ transaction.abort(); } );
};

TransactionFacade.close = function(){
	this.transactions.map( function(transaction){ transaction.close(); } );
};


