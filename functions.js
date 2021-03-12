
exports.success= (result) => ({
    status: 'success',
    result: result
})

exports.error= (message) => ({
    status: 'error',
    message: message
})
// fonctions non utilisées a inclure dans couverture jest si utilisation
// exports.strMapToObj = (strMap) => {
//     let obj = Object.create(null)
//     for (let [k,v] of strMap) {
//       obj[k] = v;
//     }
//     return obj;
// }

// exports.objToStrMap = (obj) => {
//     let strMap = new Map();
//     for (let k of Object.keys(obj)) {
//       strMap.set(k, obj[k]);
//     }
//     return strMap
// }

exports.strMapToJson = (strMap) => JSON.stringify(strMapToObj(strMap))

exports.jsonToStrMap = (jsonStr) => objToStrMap(JSON.parse(jsonStr))

exports.getOneObjOfMap = (strMap, id) => {
  let obj = Object.create(null)
  obj[id] = strMap.get(id)
  return obj;
}