var express = require("express");
var request = require('request');
var fs = require('fs');
var app = express();


const icons = {
  'location': 'm20 31.6c6.5 0 11.6-5.1 11.6-11.6s-5.1-11.6-11.6-11.6-11.6 5.1-11.6 11.6 5.1 11.6 11.6 11.6z m14.9-13.2h3.5v3.2h-3.5c-0.8 7-6.3 12.5-13.3 13.3v3.5h-3.2v-3.5c-7-0.8-12.5-6.3-13.3-13.3h-3.5v-3.2h3.5c0.8-7 6.3-12.5 13.3-13.3v-3.5h3.2v3.5c7 0.8 12.5 6.3 13.3 13.3z m-14.9-5c3.7 0 6.6 2.9 6.6 6.6s-2.9 6.6-6.6 6.6-6.6-2.9-6.6-6.6 2.9-6.6 6.6-6.6z',
  'place': 'm20 19.1q1.7 0 2.9-1.2t1.2-2.9-1.2-2.9-2.9-1.2-2.9 1.2-1.2 2.9 1.2 2.9 2.9 1.2z m0-15.7q4.8 0 8.2 3.4t3.4 8.2q0 2.4-1.2 5.5t-2.9 5.9-3.4 5.1-2.8 3.8l-1.3 1.3q-0.5-0.5-1.2-1.4t-2.9-3.6-3.5-5.2-2.8-5.8-1.2-5.6q0-4.8 3.4-8.2t8.2-3.4z'
};

function generateIPList (filepath){
  const text = fs.readFileSync(filepath, 'utf8');
  const lst = [];
  text.split(/\r?\n/).forEach((line) => {
      if (line.includes('Invalid')) {
          var match = line.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g);
          if (!lst.includes(match[0])){
              lst.push(match[0]);
          }
      }
  });
  return lst;
}


app.get("/api/getIP/:loco", function(req, res) {
  var loco = req.params.loco;

  var IPLst = generateIPList("./auth.log");
  request('https://check.torproject.org/cgi-bin/TorBulkExitList.py?ip=1.1.1.1', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var tor = body.split("\n").slice(3);
      var lst = IPLst.map(function(ip) { 
        if(tor.indexOf(ip) != -1){
          return [ip,'red',icons['place']];
        }
        else {
          return [ip,'green',icons['place']];
        }
      });

      console.log(loco);
      lst.push([loco,'black',icons['location']]);

      var GeoLoco = [];

      function makeRequest(lst, i, result) {
        request('https://freegeoip.net/json/'+lst[i][0], function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const parsed = JSON.parse(body);
                result.push(
                    { 
                        position: {
                            lat: parsed.latitude,
                            lng: parsed.longitude
                        },
                        icon: {
                          path: lst[i][2],
                          fillColor: lst[i][1],
                          fillOpacity: 1,
                          scale: 1
                        }
                    }
                );
                if (lst.length-1 > i) {
                    makeRequest(lst, i+1, result);
                } else {
                    res.json(result);
                }
            }
        });
      };

      makeRequest(lst,0,GeoLoco);
    }
  });
});


app.listen(3001, function() {
  console.log("Example app listening on port " + 3001);
});

