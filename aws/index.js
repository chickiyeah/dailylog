let BreakException = {};
let mysql = require('mysql')
let async = require("async")

let pool  = mysql.createPool({
    connectionLimit : 20,
    host     : 'chi-talk.cedn2xc6oolp.ap-northeast-2.rds.amazonaws.com',
    user     : 'ruddls030',
    password : 'dlstn0722!',
    port     : '3306',
    database : 'Users'
});

exports.handler = function(event, context, callback){

    //비동기처리를 위해서 async를 사용하였습니다.
    async.waterfall([
        function (cb) {
            //Weekly Ranking을 가져옵니다.
            pool.query(
                `UPDATE \`Write\` SET Author="${event.id}",Name="${event.Name}",Description="${event.Desc}",People_meet="${event.People_meet}",Feel="${event.Feel}",Eat="${event.Eat}",AttachFiles="${event.AttachFiles}",AREA_ADR="${event.AREA_ADR}",AREA_LOAD_ADR="${event.AREA_LOAD_ADR}",AREA_LAT="${event.AREA_LAT}",AREA_LNG="${event.AREA_LNG}",AREA_NAME="${event.AREA_NAME}",AREA_CUSTOM_NAME="${event.AREA_CUSTOM_NAME}"  WHERE Author="${event.id}" AND Created_At="${event.Created_At}"`,
                function(err, rows, fields) {
                    if (!err) {
                       if (rows.length == 0){
                           context.fail(`404 NOT FOUND id: ${event.Id}`)
                       }else{
                            context.succeed(rows); 
                            
                       }
                    } else {
                        //에러가 나면 에러를 전달합니다.
                        console.log('Error while performing Query.', err);
                        context.fail(err.message);
                    }
                }
            );
        }],
    );
};