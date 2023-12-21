import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";

LocaleConfig.locales['pt'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
  };
  
  LocaleConfig.defaultLocale = 'pt';

  
  const DateRangePicker = () => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
  
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date: any) => {
      if (!startDate || date < startDate) {
        setStartDate(date);
        setEndDate(new Date());
      } else {
        setEndDate(date);
      }
  
      hideDatePicker();
    };
  
    return (
      <View>
        <TouchableOpacity onPress={showDatePicker}>
          <Text>Selecionar datas</Text>
        </TouchableOpacity>
  
        {startDate && <Text>Data Inicial: {startDate.toISOString().split('T')[0].split("-").reverse().join("/")}</Text>}
        {endDate && <Text>Data Final: {endDate.toISOString().split('T')[0].split("-").reverse().join("/")}</Text>}
  
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          display="spinner"
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  };
  
  export default DateRangePicker;
  