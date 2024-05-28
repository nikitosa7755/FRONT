//Импорт библиотек и сторонних файлов
import api from "./api";
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Routes} from "react-router-dom";
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import DataTable from "react-data-table-component"
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import axios from "axios";
import Table from "./Table";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

var baseUrl = "http://127.0.0.1:8000/constants/result";
var finalUrl;
var xmlhttp = new XMLHttpRequest();
var url = "http://127.0.0.1:8000/constants/get";
xmlhttp.open("GET", url, true);
xmlhttp.send();
var coneHeight;
var cylinderHeight;
var Quefeed;
var Qunderfl;
var Flfeed;
var psolid;
var pfluid;
var muliqour;
var id;

xmlhttp.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    var variables = JSON.parse(this.responseText);
    coneHeight = variables.value.map(function(elem){
      return elem.coneHeight;
    });
    cylinderHeight = variables.value.map(function(elem){
      return elem.cylinderHeight;
    });
    Quefeed = variables.value.map(function(elem){
      return elem.Quefeed;
    });
    Qunderfl = variables.value.map(function(elem){
      return elem.Qunderfl;
    });
    Flfeed = variables.value.map(function(elem){
      return elem.Flfeed;
    });
    psolid = variables.value.map(function(elem){
      return elem.psolid;
    });
    pfluid = variables.value.map(function(elem){
      return elem.pfluid;
    });
    muliqour = variables.value.map(function(elem){
      return elem.muliqour;
    });
    id = variables.value.map(function(elem){
      return elem.id;
    });
    console.log("res", id, coneHeight, cylinderHeight, Quefeed, Qunderfl, Flfeed, psolid, pfluid, muliqour);
  }
};


var xmlhttp = new XMLHttpRequest();
var url = `http://127.0.0.1:8000/constants/result?consts_id=19`;
xmlhttp.open("GET", url, true);
console.log("url", url);
xmlhttp.send();
var x;
var y;
xmlhttp.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    var data = JSON.parse(this.responseText);
    x = data.value.map(function(elem){
      return elem.x;
    });
    y = data.value.map(function(elem){
      return elem.y;
    });
    console.log("y", y, x);
  }
};

// Функция для построения графика и его конфиг
function App() {
  const [formData, setFormData] = useState({
    coneHeight: "",
    cylinderHeight: "",
    Quefeed: "",
    Qunderfl: "",
    Flfeed: "",
    psolid: "",
    pfluid: "",
    muliqour: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      coneHeight: Number(formData.coneHeight),
      cylinderHeight: Number(formData.cylinderHeight),
      Quefeed: parseInt(formData.Quefeed), // Преобразование в целое число
      Qunderfl: parseInt(formData.Qunderfl), // Преобразование в целое число
      Flfeed: Number(formData.cylinderHeight),
      psolid: parseInt(formData.Qunderfl),
      pfluid: parseInt(formData.Qunderfl),
      muliqour: Number(formData.cylinderHeight),
    };

    const output = {
      coneHeight: formDataToSend.coneHeight,
      cylinderHeight: formDataToSend.cylinderHeight,
      Quefeed: formDataToSend.Quefeed,
      Qunderfl: formDataToSend.Qunderfl,
      Flfeed: formDataToSend.Flfeed,
      psolid: formDataToSend.psolid,
      pfluid: formDataToSend.pfluid,
      muliqour: formDataToSend.muliqour,
    };

    const link = 'http://127.0.0.1:8000/constants/add';

    // Create an object to send as URL parameters
    const params = {
      coneHeight: formDataToSend.coneHeight,
      cylinderHeight: formDataToSend.cylinderHeight,
      Quefeed: formDataToSend.Quefeed,
      Qunderfl: formDataToSend.Qunderfl,
      Flfeed: formDataToSend.Flfeed,
      psolid: formDataToSend.psolid,
      pfluid: formDataToSend.pfluid,
      muliqour: formDataToSend.muliqour,
    };

    // Send a GET request to the FastAPI endpoint using Axios
    axios.get(link, { params })
      .then(response => {
        console.log(response.data);
        alert('Запрос успешно отправлен');
      })
      .catch(error => {
        console.error(error);
        alert('Запрос не отправлен');
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [data1, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchTableData();
  }, []);

  async function fetchTableData() {
    setLoading(true);
    const URL = "http://127.0.0.1:8000/constants/get";
    const response = await fetch(URL);
    const users = await response.json();
    setData(users);
    setLoading(false);
  }

  const columns = [{
    name: "id",
    selector: row => row.name
  },{
    name: "Quefeed",
    selector: row => row.name
  },{
    name: "Quedn1",
    selector: row => row.name
  }];

  const information = [{
    id: id,
    name: Quefeed
  }];

  const data = {
    labels: x,
    datasets: [{
      label: "Концентрация",
      data: y,
      backgroundColor: "aqua",
      borderColor: "black",
      pointBorderColor: "aqua",
      fill: true,
      tension: 0.4
    }]
  };

  const options = {
    plugins: {
      legend: true
    },
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: "Высота, м"
        }
      },
      x: {
        display: true,
        title: {
          display: true,
          text: "Концентрация"
        }
      }
    }
  }

  return (
    <body>
      <div className="App"></div>
      <ul>
        <li className="typer"><a href="#news">Промывочная модель</a></li>         
      </ul>
      <form onSubmit={handleSubmit}>
        <label>coneHeight</label>
        <input type="number" name="coneHeight" required placeholder="Введите число" value={formData.coneHeight} onChange={handleChange} />
        <label>cylinderHeight</label>
        <input type="number" name="cylinderHeight" required placeholder="Введите число" value={formData.cylinderHeight} onChange={handleChange} />
        <label>Quefeed</label>
        <input type="number" name="Quefeed" required placeholder="Введите число" value={formData.Quefeed} onChange={handleChange} />
        <label>Qunderfl</label>
        <input type="number" name="Qunderfl" required placeholder="Введите число" value={formData.Qunderfl} onChange={handleChange} />
        <label>Flfeed</label>
        <input type="number" name="Flfeed" required placeholder="Введите число" value={formData.Flfeed} onChange={handleChange} />
        <label>psolid</label>
        <input type="number" name="psolid" required placeholder="Введите число" value={formData.psolid} onChange={handleChange} />
        <label>pfluid</label>
        <input type="number" name="pfluid" required placeholder="Введите число" value={formData.pfluid} onChange={handleChange} />
        <label>muliqour</label>
        <input type="number" name="muliqour" required placeholder="Введите число" value={formData.muliqour} onChange={handleChange} />
        <button type="submit" className="klass">Изменить</button>
        <p>{url}</p>
    <script src="app.js"></script>
      </form>
      <div className="Graphic">
        <Line data={data} options={options} progressPending={loading}></Line>
      </div>
    </body>
  );
}

export default App;
