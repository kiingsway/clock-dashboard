import { capitalizeWords } from '../formatters/textFormatters';
import { DateTime } from 'luxon';
import { getUSASeverityColor } from './getSeverityColor';
import { IWeatherAlert } from '@/types/weatherAlerts.types';
import { IWeatherAlertCanada } from '@/types/WeatherAlerts/canada.types';
import { IWeatherAlertUSAItemProps } from '@/types/WeatherAlerts/usa.types';

export function canadaAlertMapper(rawAlerts?: IWeatherAlertCanada[]): IWeatherAlert[] {
  if (!rawAlerts?.length) return [];
  return rawAlerts.map(rawAlert => {
    const { id, properties: {
      alert_type: status,
      alert_name_en,
      alert_short_name_en,
      alert_text_en: description,
      event_end_datetime,
      feature_name_en: location,
      risk_colour_en,

      confidence_en,
      impact_en,
      status_en,
      province,
      alert_code,
    } } = rawAlert;

    const shortTitle = capitalizeWords(alert_short_name_en)
    const title = alert_name_en ? capitalizeWords(alert_name_en) : shortTitle;

    return {
      country: 'CA',
      id,
      title,
      shortTitle,
      status,
      description,
      expires: DateTime.fromISO(event_end_datetime),
      location,
      color: risk_colour_en,
      properties: [
        { label: 'Confidence', value: confidence_en },
        { label: 'Impact', value: impact_en },
        { label: 'Type', value: status_en },
        { label: 'Province', value: province },
        { label: 'Code', value: alert_code },
      ].filter(p => Boolean(p.value)),
      descriptions: []
    }
  });
}

export function usaAlertMapper(rawAlerts?: IWeatherAlertUSAItemProps[]): IWeatherAlert[] {
  if (!rawAlerts?.length) return [];
  return rawAlerts.map(alert => {

    const { id, properties: {
      event: title,
      severity: status,
      description,
      ends,
      areaDesc: location,

      status: statusProp,
      messageType,
      category,
      certainty,
      urgency,
      instruction,
      response
    } } = alert;

    return {
      country: 'US',
      id,
      title,
      shortTitle: title,
      status,
      description,
      expires: DateTime.fromISO(ends),
      location,
      color: getUSASeverityColor(status),
      properties: [
        { label: 'Status', value: statusProp },
        { label: 'Category', value: category },
        { label: 'Type', value: messageType },
        { label: 'Certainty', value: certainty },
        { label: 'Urgency', value: urgency },
        { label: 'Response', value: response },
      ].filter(p => Boolean(p.value)),
      descriptions: [
        { label: 'Instructions', value: instruction },
      ].filter(p => Boolean(p.value)),
    }
  });
}