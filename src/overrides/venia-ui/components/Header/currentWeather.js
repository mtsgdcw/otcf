import React from 'react';
import { shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useCurrentWeather } from '@talons/Header/useCurrentWeather';

import defaultClasses from './currentWeather.module.css';

const CurrentWeather = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const { weatherData, loading, error } = useCurrentWeather();

    const ERROR_MESSAGE = formatMessage({
        id: 'app.errorUnexpected',
        defaultMessage: 'Sorry! An unexpected error occurred.'
    });

    const { temp_c, temp_f, city, countryCode, icon, alt } = weatherData || {};

    if (loading)
        return <LoadingIndicator classes={{ root: classes.indicator }} />;

    if (error) return <p className={classes.error}>{ERROR_MESSAGE}</p>;

    if (!weatherData) return null;

    return (
        <div className={classes.root}>
            <span>{`${city}, ${countryCode}`}</span>
            <div className={classes.weatherDetails}>
                <img
                    loading="lazy"
                    className={classes.weatherIcon}
                    src={icon}
                    alt={alt}
                />
                <span>{`${temp_c} °c (${temp_f} °f)`}</span>
            </div>
        </div>
    );
};

export default CurrentWeather;

CurrentWeather.propTypes = {
    classes: shape({
        root: string,
        indicator: string,
        error: string,
        weatherDetails: string,
        weatherIcon: string
    })
};
