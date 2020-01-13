import React from 'react';
import './styles/index.scss';
import { Link } from 'react-router-dom';
import ToTrack from './ToTrack';

class Main extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <ToTrack />
        <h4>
          <Link to="/cost"> Рассчитать стоимость доставки</Link>
        </h4>
        <h4>
          <Link to="/departments" >
            Посмотреть ближайшие отделения
          </Link>
        </h4>
      </div>
    );
  }
}

export default Main;
