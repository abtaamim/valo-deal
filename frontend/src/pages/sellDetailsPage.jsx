import React from 'react';
import GenericForm from './GenericForm';

const ComputerSellPage = () => {
  return <GenericForm category="computer" endpoint="computer" />;
};

const VehicleSellPage = () => {
  return <GenericForm category="vehicle" endpoint="vehicle" />;
};

const ElectronicsSellPage = () => {
  return <GenericForm category="electronics" endpoint="electronic" />;
};



export { ComputerSellPage, VehicleSellPage, ElectronicsSellPage };
