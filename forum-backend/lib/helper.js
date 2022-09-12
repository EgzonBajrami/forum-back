module.exports = {
    jsonResponse:(data, success=true) =>{
        return{
            success,
            data,
        }
    },
}