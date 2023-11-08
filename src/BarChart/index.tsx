/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import styled from 'styled-components';
import { DebtServiceType, CategoryData } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: DebtServiceType[];
  categories: CategoryData[];
}
const GraphDiv = styled.div`
  @media (max-width: 960px) {
    height: 500px;
  }
`;
const numberPercentOptions = ['number', 'percentage'];
const revenueExportsOptions = ['revenue', 'exports'];

export function BarChart(props: Props) {
  const { data, categories } = props;
  const [totalPercentSelection, setTotalPercentSelection] = useState('number');
  const [revenueExportsSelection, setRevenueExportsSelection] =
    useState('revenue');
  const [categorySelection, setCategorySelection] = useState('All developing');
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight);
      setSvgWidth(graphDiv.current.clientWidth);
    }
  }, [graphDiv]);
  return (
    <GraphDiv ref={graphDiv}>
      <div>
        <div className='margin-bottom-05'>
          <div>
            <p className='label undp-typography'>Select a category</p>
            <Select
              options={categories.map(d => ({
                label: d.description,
                value: d.description,
              }))}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => {
                setCategorySelection(el);
              }}
              value={categorySelection}
            />
          </div>
        </div>
      </div>
      <div className='chart-container'>
        <div className='margin-bottom-03'>
          <div>
            <h6 className='undp-typography margin-bottom-01'>
              Number of countries for which external public total (AMT+INT) debt
              service exceeds 20% of revenue/exports and primary income
            </h6>
            <p className='undp-typography small-font margin-bottom-01'>
              Years: 1995-2023
            </p>
          </div>
          <div className='flex-div flex-space-between flex-wrap'>
            <div>
              <Radio.Group
                defaultValue={totalPercentSelection}
                onChange={(el: RadioChangeEvent) => {
                  setTotalPercentSelection(el.target.value);
                }}
              >
                {numberPercentOptions.map((d, i) => (
                  <Radio key={i} className='undp-radio' value={d}>
                    {d}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <div>
              <Radio.Group
                defaultValue={revenueExportsSelection}
                onChange={(el: RadioChangeEvent) => {
                  setRevenueExportsSelection(el.target.value);
                }}
              >
                {revenueExportsOptions.map((d, i) => (
                  <Radio key={i} className='undp-radio' value={d}>
                    {d}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        </div>
        {svgHeight && svgWidth ? (
          <Graph
            data={data.filter(d => d.region === categorySelection)}
            totalPercentOption={totalPercentSelection}
            revenueExportsOption={revenueExportsSelection}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
          />
        ) : null}
        <p className='source'>
          Source: Author based on World Bank IDS 2022 and IMF WEO April 2023
        </p>
      </div>
    </GraphDiv>
  );
}
