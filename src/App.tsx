/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { CategoryData, DebtServiceType } from './Types';
import { BarChart } from './BarChart';
import './style.css';

function App() {
  const [debtServiceData, setDebtServiceData] = useState<
    DebtServiceType[] | undefined
  >();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-to-gdp/main/public/data/';
  // const dataurl = './data/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}externalDebtService.csv`),
      csv(`${dataurl}categories.csv`),
    ]).then(([data, categories]) => {
      setDebtServiceData(data as any);
      setCategoriesData(categories as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtServiceData && categoriesData ? (
        <BarChart data={debtServiceData} categories={categoriesData} />
      ) : null}
    </div>
  );
}

export default App;
