import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"

var fs = require('fs');
var request = require('request');

function getIP(path){
    const text = fs.readFileSync(path, 'utf8');
    const lst = [];
    text.split(/\r?\n/).forEach((line) => {
        if (line.includes('Invalid')) {
            var match = line.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g);
            if (!lst.includes(match[0])){
                lst.push(match[0]);
            }
        }
    });
    return lst
}

function getLocation(lst, callback){
    function makeRequest(lst, i, result, cb) {
        request('https://freegeoip.net/json/'+lst[i], function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const parsed = JSON.parse(body);
                result.push(
                    { 
                        position: {
                            lat: parsed.latitude,
                            lng: parsed.longitude
                        }
                    }
                );
                if (lst.length-1 > i) {
                    makeRequest(lst, i+1, result, cb);
                } else {
                    cb(result);
                }
            }
        });
    };


    if (lst.length > 0) {
        makeRequest(lst, 0, [], callback);
    }
}

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            markers: []
        }
    }
    componentDidMount(){
        const lst = getIP('/var/log/auth.log');
        getLocation(lst, (result) => {
            this.setState({markers : result});
            console.log(result);
        });
    }
    render() {
        return (
            <GoogleMap
                defaultZoom={2}
                defaultCenter={{ lat: -14.37694, lng: -73.88080 }}
            >   
                {this.state.markers.map((marker,index) =>  (
                        <Marker {...marker} />
                    )
                )}
            </GoogleMap>
        )
    }
}

export default withGoogleMap(Main)
