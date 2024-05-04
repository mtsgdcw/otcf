import { useEffect, useState } from 'react';

import isObjectEmpty from '@magento/peregrine/lib/util/isObjectEmpty';

const countryCodes = {
    Poland: 'PL',
    Germany: 'DE',
    Slovakia: 'SK',
    Ukraine: 'UA',
    Lithuania: 'LT'
};

export const useCurrentWeather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = 'https://api.weatherapi.com/v1/current.json';
    const apiKey = process.env.WEATHER_API_KEY;
    const defaultCoordinates = '50.049683,19.944544';

    const getWeatherData = coordinates => {
        if (!apiKey) return;

        fetch(`${apiUrl}?key=${apiKey}&q=${coordinates}`)
            .then(response => {
                if (!response.ok) {
                    setError(true);
                    setLoading(false);
                }

                return response.json();
            })
            .then(data => {
                const {
                    current: {
                        temp_c,
                        temp_f,
                        condition: { icon, text: alt } = {}
                    } = {},
                    location: { country, name: city } = {}
                } = data;

                const countryCode = countryCodes[country] || country;

                setWeatherData({
                    temp_c,
                    temp_f,
                    icon,
                    alt,
                    countryCode,
                    city
                });
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!isObjectEmpty(navigator.geolocation)) {
            getWeatherData(defaultCoordinates);
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position?.coords;

                const coordinates = `${latitude},${longitude}`;

                getWeatherData(coordinates);
            },
            () => {
                getWeatherData(defaultCoordinates);
            }
        );
    }, []);

    return { weatherData, loading, error };
};
