// This is a hack to make this work without a DNS module
//Which isnt made yet... (?)
// No, the blank file makes it work
module.exports.resolveSrv = function(hostname, callback) {
  const Http = new XMLHttpRequest();
  const url= `https://dns.google.com/resolve?name=${hostname}&type=SRV`;
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    // console.log(Http.responseText)
    let response;
    try {
      response = JSON.parse(Http.responseText)
    } catch (err) {
      return callback(err)
    }
    if (response.Status !== 0) {
      return callback(new Error('Fail'))
    }
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
  }
}