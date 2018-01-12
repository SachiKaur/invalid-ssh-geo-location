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
        axios.post('http://127.0.0.1:8080/api/getIP', {
            filepath: '/var/log/auth.log',
        })
        .then(function (response) {
            if(response.data.IPList){
                var lst = response.data.IPList
                getLocation(lst, (result) => {
                    this.setState({markers : result});
                    console.log(result);
                });
            }
        })
        .catch(function (error) {
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
