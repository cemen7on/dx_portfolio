use('Core').HTTPRequest=function(url, method, data, responseType){
    method=method || 'GET';
    data=data || {};
    responseType=responseType || 'json';

    return new Core.Promise(function(resolve, reject){
        $.ajax({
            url:url,
            type:method,
            data:data,
            dataType:responseType,
            success:function(response){
                if(!response || !response.success){
                    reject({message:'No response was received', code:0});

                    return ;
                }

                resolve(response.success);
            },
            error:function(jXHR, status, statusMessage){
                var errorObject;

                try{
                    errorObject=JSON.parse(jXHR.responseText);
                }
                catch(e){
                    errorObject=jXHR.responseText;
                }

                reject(errorObject, jXHR.status, statusMessage);
            }
        });
    });
};
