import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import axios from "axios";

var request = require('request');

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
        const lst = ["41.238.236.189","123.21.164.250","14.162.181.33","79.129.223.158",
            "117.241.203.56","51.254.118.92","14.232.23.94","159.192.123.199","210.212.215.165",
            "218.108.137.106","113.215.220.206","193.201.224.241","51.254.208.16","188.17.29.104",
            "193.201.224.158","151.80.40.4","202.29.240.157", "219.245.18.189","222.176.192.88",
            "170.0.141.126","14.231.245.249","223.84.128.24","195.154.39.130","103.89.89.172",
            "89.108.86.26","5.188.10.156"]
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
