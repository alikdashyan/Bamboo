const arrayToJSON = (array) => {
    const keys = array[0]
    const data =[]
    for(let i=1; i<array.length; i++){
        let ob = {}
        for(let j=0; j<keys.length; j++){
            if(keys[j] === "User ID") {continue}
            ob[keys[j]] = array[i][j]
        }
        data.push(ob)
    }
    return data
}

module.exports = arrayToJSON