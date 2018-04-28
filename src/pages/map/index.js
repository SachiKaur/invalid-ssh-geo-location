import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import $ from 'jquery'; 
//import axios from "axios";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: []
        }
    }
    componentDidMount(){
        console.log("Gets Mounted")
        var that = this;
        $.get("http://ipinfo.io", function(response) {
            console.log(response.ip);
            $.ajax({
                method: "GET",
                url: "/api/getIP/" + response.ip
            }).done(function(data){
                that.setState({markers : data});
            });
        }, "jsonp");
    }
    render(){
        return (  
            <GoogleMap
                defaultZoom={2}
                defaultCenter={{ lat: -14.37694, lng: -73.88080 }}
            >   
                {this.state.markers.map((marker,index) =>  (
                        <Marker icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>} {...marker} />
                    )
                )}
            </GoogleMap>
        );
    }
}

export default withGoogleMap(Main)
