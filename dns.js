
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
    if (response.Status === 3) {
      const err = new Error('querySrv ENOTFOUND')
      err.code = 'ENOTFOUND'
      console.log(err.code)
      return;
    }
    console.log(response.Status)
    if (!response.Answer || response.Answer.length < 1) {
      const err = new Error('querySrv ENOTFOUND')
      callback(new Error('querySrv ENODATA'), [])
      return;
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