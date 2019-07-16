function LocalStorage () {
    this.indexedDB = null;
    this.localStorage = null;
    this.db_name = 'local_storage';
    this.tb_name = 'local_storage';
    this.open = async function ( version ) {
        return new Promise ( ( resolve , reject ) => {
            //
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
            //
            this.localStorage = localStorage;
            this.indexedDB = indexedDB.open ( this.db_name , version );
            let this_object = this;
            this.indexedDB.onsuccess = function ( event ) {
                this_object.indexedDB.db = event.target.result;
                console.log ( 'local storage connect is success' );
                console.log ( event );
                resolve ( 1 );
            };
            this.indexedDB.onerror = function ( event ) {
                this_object.indexedDB.db = null;
                this_object.indexedDB.updated = - 1;
                console.log ( 'local storage connect is error' );
                console.log ( event );
                reject ( event );
            };
            this.indexedDB.onupgradeneeded = function ( event ) {
                this_object.indexedDB.db = event.target.result;
                this_object.indexedDB.updated = 1; //已开始更新
                console.log ( 'local storage db is update' );

                try {
                    if ( ! this_object.indexedDB.db.objectStoreNames.contains ( this_object.tb_name ) ) { //检查表是否存在，如果不存在
                        objectStore = this_object.indexedDB.db.createObjectStore ( this_object.tb_name , { keyPath : "name" } ); //创建表
                        objectStore.createIndex ( 'status' , 'status' , { unique : false } ); //创建表索引，索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
                        console.log ( event );
                    }
                } catch ( e ) {
                    this_object.indexedDB.updated = - 1;
                    console.log ( e );
                    reject ( e );
                }
                event.target.transaction.oncomplete = function ( event ) { //事务结束事件回调函数
                    console.log ( event );
                    this_object.indexedDB.updated = 2; //已结束更新
                    resolve ( 2 );
                };
            };
        } );

    };
    this.wait = async function ( timeout ) {
        let this_object = this;
        return new Promise ( ( resolve , reject ) => {
            try {
                setTimeout ( function () {
                                 resolve ( this_object.indexedDB.updated );
                             }
                    , timeout );
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.close = async function () {
        return new Promise ( ( resolve , reject ) => {
            try {
                if ( ( typeof( this.indexedDB ) !== "undefined" ) && ( this.indexedDB !== null ) ) {
                    this.indexedDB.db.close ();
                    resolve ( 1 );
                } else {
                    resolve ( 0 );
                }
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.getItem = async function ( key ) {
        let this_object = this;
        console.log ( this_object );

        return new Promise ( ( resolve , reject ) => {
            try {
                let ret = this_object.indexedDB.db.transaction ( [ this_object.tb_name ] , 'readwrite' ).objectStore ( this_object.tb_name ).get ( key );
                ret.onsuccess = function ( event ) {
                    console.log ( 'local storage get data ( ' + key + ' ) is success' );
                    console.log ( event );
                    resolve ( event.target.result );
                };
                ret.onerror = function ( event ) {
                    console.log ( 'local storage get data ( ' + key + ' ) is error' );
                    console.log ( event );
                    reject ( e );
                };
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.setItem = async function ( key , val , val_timeout ) {
        let this_object = this;
        console.log ( this_object );

        return new Promise ( ( resolve , reject ) => {
            try {
                let ret = this_object.indexedDB.db.transaction ( [ this_object.tb_name ] , 'readwrite' ).objectStore ( this_object.tb_name ).put ( {
                                                                                                                                                       name : key ,
                                                                                                                                                       val : val ,
                                                                                                                                                       expires : ( ( ( new Date () ).getTime () ) + ( val_timeout * 1000 ) )
                                                                                                                                                   } );
                ret.onsuccess = function ( event ) {
                    console.log ( 'local storage set data ( ' + key + ' ) is success' );
                    console.log ( event );
                    resolve ( event.target.result );
                };
                ret.onerror = function ( event ) {
                    console.log ( 'local storage set data ( ' + key + ' ) is error' );
                    console.log ( event );
                    reject ( 0 );
                };
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.removeItem = async function ( key ) {
        let this_object = this;
        console.log ( this_object );

        return new Promise ( ( resolve , reject ) => {
            try {
                let ret = this_object.indexedDB.db.transaction ( [ this_object.tb_name ] , 'readwrite' ).objectStore ( this_object.tb_name ).delete ( key );
                ret.onsuccess = function ( event ) {
                    console.log ( 'local storage remove data ( ' + key + ' ) is success' );
                    console.log ( 1 );
                    resolve ( 1 );
                };
                ret.onerror = function ( event ) {
                    console.log ( 'local storage remove data ( ' + key + ' ) is error' );
                    console.log ( 0 );
                    resolve ( 0 );
                };
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.clear = async function () {
        let this_object = this;
        console.log ( this_object );

        return new Promise ( ( resolve , reject ) => {
            try {
                let ret = this_object.indexedDB.db.transaction ( [ this_object.tb_name ] , 'readwrite' ).objectStore ( this_object.tb_name ).clear ();
                ret.onsuccess = function ( event ) {
                    console.log ( 'local storage clear datas is success' );
                    console.log ( 1 );
                    resolve ( 1 );
                };
                ret.onerror = function ( event ) {
                    console.log ( 'local storage clear datas is error' );
                    console.log ( 0 );
                    resolve ( 0 );
                };
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.keys = async function () {
        let this_object = this;
        console.log ( this_object );

        return new Promise ( ( resolve , reject ) => {
            try {
                let ret = this_object.indexedDB.db.transaction ( [ this_object.tb_name ] , 'readwrite' ).objectStore ( this_object.tb_name ).getAllKeys ();
                ret.onsuccess = function ( event ) {
                    console.log ( 'local storage get keys is success' );
                    console.log ( event );
                    resolve ( event.target.result );
                };
                ret.onerror = function ( event ) {
                    console.log ( 'local storage get keys is error' );
                    console.log ( event );
                    reject ( e );
                };
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.gets = async function () {
        let this_object = this;
        console.log ( this_object );

        return new Promise ( ( resolve , reject ) => {
            try {
                let ret = this_object.indexedDB.db.transaction ( [ this_object.tb_name ] , 'readwrite' ).objectStore ( this_object.tb_name ).getAll ();
                ret.onsuccess = function ( event ) {
                    console.log ( 'local storage get datas is success' );
                    console.log ( event );
                    resolve ( event.target.result );
                };
                ret.onerror = function ( event ) {
                    console.log ( 'local storage get datas is error' );
                    console.log ( event );
                    reject ( event );
                };
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
    this.count = async function () {
        let this_object = this;
        console.log ( this_object );

        return new Promise ( ( resolve , reject ) => {
            try {
                let ret = this_object.indexedDB.db.transaction ( [ this_object.tb_name ] , 'readwrite' ).objectStore ( this_object.tb_name ).count ();
                ret.onsuccess = function ( event ) {
                    console.log ( 'local storage get count is success' );
                    console.log ( event );
                    resolve ( event.target.result );
                };
                ret.onerror = function ( event ) {
                    console.log ( 'local storage get count is error' );
                    console.log ( event );
                    reject ( e );
                };
            } catch ( e ) {
                reject ( e );
            }
        } );
    };
}


var localstorage = new LocalStorage ();