import React, { useState } from 'react';
import styles from './Weather.module.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [emoji, setEmoji] = useState('');
  const [bgClass, setBgClass] = useState('');

  const API_KEY = '2cd0945dce65ac68832bceef480e8c84'; 

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  };

  const handleSearch = async () => {
    if (!city) {
      setError('Введите название города');
      speak('Введите название города');
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setWeather(data);
      setError('');

      const condition = data.weather[0].main.toLowerCase();

      if (condition.includes('rain')) {
        speak('Возьмите с собой зонтик');
        setEmoji('😢');
        setBgClass('rainy');
      } else if (condition.includes('clear')) {
        speak('Сегодня погода отлично');
        setEmoji('😄');
        setBgClass('sunny');
        const audio = new Audio('/sounds/sunny.mp3');
        audio.oncanplaythrough = () => audio.play();
      } else if (condition.includes('clouds')) {
        speak('Погода ветрено, оденьтесь теплее');
        setEmoji('🙂');
        setBgClass('cloudy');
      } else {
        speak('Погода нормальная');
        setEmoji('😐');
        setBgClass('');
      }

    } catch {
      setWeather(null);
      setError('Не удалось найти погоду для этого города');
      speak('Не удалось найти погоду для этого города');
      setEmoji('');
      setBgClass('');
    }
  };

  return (
    <div className={`${styles.container} ${styles[bgClass]}`}>
      <h1 className={styles.title}>Погода</h1>
      <input
        className={styles.input}
        type="text"
        placeholder="Введите город"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button className={styles.button} onClick={handleSearch}>Найти</button>

      {error && <p className={styles.error}>{error}</p>}

      {weather && (
        <div className={styles.result}>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Погода: {weather.weather[0].description}</p>
          <p>Ветер: {weather.wind.speed} м/с</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
            className={styles.weatherIcon}
          />
          <div className={styles.emoji}>{emoji}</div>
        </div>
      )}
    </div>
  );
};

export default Weather;
