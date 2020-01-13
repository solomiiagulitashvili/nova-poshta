import React from 'react';
import './styles/index.scss';
import {
  Button, FormGroup, Label, Input,
} from 'reactstrap';

class ToTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: '',
      telephone: 0,
      info: null,
    };
  }

  track = () => {
    fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: 'fc2eb4c7e8aab83604cfee2112e021c8',
        modelName: 'TrackingDocument',
        calledMethod: 'getStatusDocuments',
        methodProperties: {
          Documents: [
            {
              DocumentNumber: this.state.invoice,
              Phone: this.state.telephone,
            },
          ],
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('error');
      })
      .then((info) => {
        this.setState({ info: info.data[0] });
      });
  }

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="track">
        <h3>Отследить</h3>
        <FormGroup>
          <Label for="invoice">Номер накладной</Label>
          <Input
            type="text"
            name="invoice"
            id="invoice"
            value={this.state.invoice}
            onChange={this.onInputChange}
            placeholder="Введите номер накладной"
          />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Телефон</Label>
          <Input
            type="telephone"
            name="telephone"
            id="phone"
            value={this.state.telephone}
            onChange={this.onInputChange}
            placeholder="Введите номер телефона"
          />
        </FormGroup>
        <Button color="danger" onClick={this.track}>Отследить</Button>
        {this.state.info
          ? <div className="results">
          <p>Отделение: {this.state.info.WarehouseRecipient} </p>
          <p>Маршрут: {this.state.info.CitySender} - {this.state.info.CityRecipient} </p>
          <p>Ожидаемая дата доставки: {this.state.info.ScheduledDeliveryDate} </p>
          <p>Плательщик: {this.state.info.PayerType} {' '} {this.state.info.DocumentCost} грн.</p>
        </div>
          : <p></p>
      }
      </div>
    );
  }
}

export default ToTrack;
