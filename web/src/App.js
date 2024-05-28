import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './App.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title
} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
  zoomPlugin
);

const App = () => {
  const [formData, setFormData] = useState({
    coneHeight: '',
    cylinderHeight: '',
    Quefeed: '',
    Qunderfl: '',
    Flfeed: '',
    psolid: '',
    pfluid: '',
    muliqour: '',
  });

  const [resultData, setResultData] = useState([]);
  const [id, setId] = useState(null);
  const [resultX, setResultX] = useState([]);
  const [resultY, setResultY] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://127.0.0.1:8000/constants/add', {
        params: {
          coneHeight: formData.coneHeight,
          cylinderHeight: formData.cylinderHeight,
          Quefeed: formData.Quefeed,
          Qunderfl: formData.Qunderfl,
          Flfeed: formData.Flfeed,
          psolid: formData.psolid,
          pfluid: formData.pfluid,
          muliqour: formData.muliqour,
        },
      });

      console.log(response.data);
      setId(response.data.consts_id);
      alert('Запрос успешно отправлен');
    } catch (error) {
      console.error(error);
      alert('Запрос не отправлен');
    }
  };

  console.log("id", id);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/constants/result?consts_id=${id}`);
          const result = response.data.value;
          const xValues = result.map(item => item.x);
          const yValues = result.map(item => item.y);
          setResultX(xValues);
          setResultY(yValues);
          setResultData(result);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div class="flex-container">
      <ul>
        <li className="typer" ><a href="#news">Промывочная модель</a></li>         
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          coneHeight:
          <input
            type="number"
            name="coneHeight"
            required
            placeholder="Введите число"
            value={formData.coneHeight}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          cylinderHeight:
          <input
            type="number"
            name="cylinderHeight"
            required
            placeholder="Введите число"
            value={formData.cylinderHeight}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Quefeed:
          <input
            type="number"
            name="Quefeed"
            required
            placeholder="Введите число"
           value={formData.Quefeed}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Qunderfl:
          <input
            type="number"
            name="Qunderfl"
            required
            placeholder="Введите число"
            value={formData.Qunderfl}
            onChange={handleChange}
          />
        </label>
        <br/>

        <label>
          Flfeed:
          <input
            type="number"
            name="Flfeed"
            required
            placeholder="Введите число"
            value={formData.Flfeed}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          psolid:
          <input
            type="number"
            name="psolid"
            required
            placeholder="Введите число"
            value={formData.psolid}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          pfluid:
          <input
            type="number"
            name="pfluid"
            required
            placeholder="Введите число"
            value={formData.pfluid}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          muliqour:
          <input
            type="number"
            name="muliqour"
            required
            placeholder="Введите число"
            value={formData.muliqour}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type="submit" className="klass">
          Изменить
        </button>
      </form>
      <div className="Graphic" >
        {resultData.length > 0 ? (
          <Line
            data={{
              labels: resultX,
              datasets: [
                {
                  label: 'Концентрация',
                  data: resultY,
                  backgroundColor: '#45a049',
                  borderColor: 'black',
                  pointBorderColor: '#45a049',
                  fill: true,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              plugins: {
                legend: true,
                zoom: {
                  zoom: {
                    wheel: {
                      enabled: true,
                    },
                    pinch: {
                      enabled: true
                    },
                    mode: 'x',
                  },
                  pan: {
                    enabled: true,
                    mode: 'x',
                  },
                },
              },
              scales: {
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Концентрация',
                  },
                },
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Высота',
                  },
                  min: 0, // start from the first data point
                  max: 100 // show the first 100 data points
                },
              },
            }}
          />
        ) : (
          <p className='loading-placeholder'>Ожидание данных...</p>
        )}
      </div>
    </div>
  );
};

export default App;
