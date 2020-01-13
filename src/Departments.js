import React from 'react';
import './styles/index.scss';


class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 55000,
    };
    this.state = {
      depList: [],
    };
  }


  geocode = (lat, long) => {
    fetch(
      `https://eu1.locationiq.com/v1/reverse.php?key=fa9bad51886f22&lat=${lat}&lon=${long}E&format=json`,
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('error');
      })
      .then((body) => {
        fetch('https://api.novaposhta.ua/v2.0/json/', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
              Language: 'ru',
              CityName: body.address.city,
            },
            apiKey: 'fc2eb4c7e8aab83604cfee2112e021c8',
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('error');
          })
          .then((depList) => {
            this.setState({ depList: depList.data });
          });
      })

      .catch((err) => {
        throw err;
      });
  };

  successFunction = (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    this.geocode(lat, long);
  };

  errorFunction = (error) => {
    if (error.code === 1) {
      alert(
        "You've decided not to share your position, but it's OK. We won't ask you again.",
      );
    } else if (error.code === 2) {
      alert("The network is down or the positioning service can't be reached.");
    } else if (error.code === 3) {
      alert('The attempt timed out before it could get the location data.');
    } else {
      alert('Geolocation failed due to unknown error.');
    }
  };


  componentDidMount = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.successFunction,
        this.errorFunction,
        this.options,
      );
    } else {
      alert(
        'It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.',
      );
    }
  };

  render() {
    const { depList } = this.state;
    return (
      <div>
        <ul className="depList">
          {depList.map((dep) => <li key={dep.SiteKey}>{dep.DescriptionRu}</li>)}
        </ul>
      </div>
    );
  }
}

export default Departments;
