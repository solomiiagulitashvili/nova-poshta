import React, { Fragment } from 'react';
import './styles/index.scss';
import {
  Button, Form, FormGroup, Label, Input,
} from 'reactstrap';


class Cost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CitySender: '',
      CitySenderCode: '',
      CityRecipient: '',
      CityRecipientCode: '',
      Weight: 0,
      ServiceType: 'WarehouseWarehouse',
      Cost: 0,
      CargoType: 'Parcel',
      SeatsAmount: 0,
      cost: 0,
    };
  }

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSelectChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  convertCities = () => {
    fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelName: 'Address',
        calledMethod: 'getCities',
        apiKey: 'fc2eb4c7e8aab83604cfee2112e021c8',
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('error');
      })
      .then((sitiesList) => {
        const route = sitiesList.data.filter((item) => (item.DescriptionRu === this.state.CitySender || item.DescriptionRu === this.state.CityRecipient));
        return route;
      })
      .then((route) => {
        this.setState({ CitySenderCode: route[0].Ref, CityRecipientCode: route[1].Ref }, () => {
          this.calculateCost();
        });
      });
  }

  calculateCost = () => {
    fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelName: 'InternetDocument',
        calledMethod: 'getDocumentPrice',
        methodProperties: {
          CitySender: this.state.CitySenderCode,
          CityRecipient: this.state.CityRecipientCode,
          Weight: this.state.Weight,
          ServiceType: this.state.ServiceType,
          Cost: this.state.Cost,
          CargoType: this.state.CargoType,
          SeatsAmount: this.state.SeatsAmount,
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
      .then((cost) => {
        if (cost.data[0]) {
          this.setState({ cost: cost.data[0].Cost });
        } else {
          alert('Something gone wrong, try again later!');
        }
      });
  }

  render() {
    return (
      <Fragment>
        <h2>Рассчитать стоимость доставки</h2>
        <Form>
          <FormGroup>
            <Label for="CitySender">Город отправителя</Label>
            <Input type="text" name="CitySender" id="CitySender" value={this.state.citySender} onChange={this.onInputChange} placeholder="Введите город отправителя" />
          </FormGroup>
          <FormGroup>
            <Label for="CityRecipient">Город получателя</Label>
            <Input type="text" name="CityRecipient" id="CityRecipient" value={this.state.cityRecipient} onChange={this.onInputChange} placeholder="Введите город получателя" />
          </FormGroup>
          <FormGroup>
            <Label for="Weight">Вес</Label>
            <Input type="text" name="Weight" id="Weight" value={this.state.Weight} onChange={this.onInputChange} placeholder="Введите вес посылки в кг" />
          </FormGroup>
          <FormGroup>
            <Label for="ServiceType">Тип услуги</Label>
              <Input type="select" name="ServiceType" id="ServiceType" onChange={this.onSelectChange}>
              <option value="WarehouseWarehouse">Отделение-Отделение</option>
              <option value="DoorsDoors">Адрес-Адрес</option>
              <option value="DoorsWarehouse">Адрес-Отделение</option>
              <option value="WarehouseDoors">Отделение-Адрес</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="Cost">Обьявленная стоимость</Label>
            <Input type="text" name="Cost" id="Cost" value={this.state.Cost} onChange={this.onInputChange} placeholder="Введите обьявленную стоимость" />
          </FormGroup>
          <FormGroup>
            <Label for="CargoType">Вид посылки</Label>
            <Input type="select" name="CargoType" id="CargoType" onChange={this.onSelectChange}>
              <option value="Parсel">Посылка</option>
              <option value="Cargo">Груз</option>
              <option value="Documents">Документы</option>
              <option value="TiresWheels">Шины и диски</option>
              <option value="Pallet">Паллеты</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="SeatsAmount">Место</Label>
            <Input type="text" name="SeatsAmount" id="SeatsAmount" value={this.state.SeatsAmount} onChange={this.onInputChange} placeholder="Введите количество мест отправления" />
          </FormGroup>
            <Button onClick={this.convertCities}>Рассчитать</Button>
        </Form>
        {this.state.cost ? <h3>Стоимость доставки составляет {this.state.cost} грн.</h3> : <p></p>}
      </Fragment>
    );
  }
}

export default Cost;
