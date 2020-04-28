// This is a hack to make this work without a DNS module
//Which isnt made yet... (?)
// No, the blank file makes it work
module.exports.resolveSrv = function(hostname, callback) {
  const Http = new XMLHttpRequest();
  const url= `https://dns.google.com/resolve?name=${hostname}&type=SRV`;
  Http.open("GET", url);
  Http.responseType = 'json';
  Http.send();
  
  Http.onload = function() {
    const response = Http.response;
    if (response.Answer.length < 1) {
      return callback(new Error('No srv record'))
    }
    console.log('status: ' + response.Status)
    const willreturn = []
    response.Answer.forEach(function (object) {
      const data = object.data.split(' ')
      willreturn.push({
        priority: data[0],
        weight: data[1],
        port: data[2],
        name: data[3]
      })
    })
    callback(undefined, willreturn)
  };
}