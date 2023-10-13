/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { DebtServiceType } from '../Types';

interface Props {
  data: DebtServiceType[];
  totalPercentOption: string;
  revenueExportsOption: string;
  svgWidth: number;
  svgHeight: number;
}

export function Graph(props: Props) {
  const {
    data,
    totalPercentOption,
    revenueExportsOption,
    svgWidth,
    svgHeight,
  } = props;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const minParam = 0;
  const combiOption = `${totalPercentOption}_${revenueExportsOption}`;
  const valueArray: number[] = data.map((d: any) => Number(d[combiOption]));
  const maxParam = max(valueArray) ? max(valueArray) : 0;
  const xDomain = data.map((d: any) => d.year);
  const x = scaleBand()
    .domain(xDomain as [])
    .range([0, graphWidth])
    .padding(0.1);
  const y = scaleLinear()
    .domain([minParam as number, maxParam as number])
    .range([graphHeight, 0])
    .nice();

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth)
    .tickFormat(
      (d: any) => `${d}${totalPercentOption === 'percentage' ? '%' : ''}`,
    );
  const xAxis = axisBottom(x)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => (d % 5 !== 0 ? '' : `${d}`));
  useEffect(() => {
    const svg = select('#debtNetInterest');
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, [data]);
  return (
    <div>
      {valueArray.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          id='debtNetInterest'
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g className='xAxis' transform={`translate(0 ,${graphHeight})`} />
            <g className='yAxis' transform='translate(0,0)' />
            <g>
              {data.map((d, i) => (
                <g key={i}>
                  <rect
                    x={x(d.year)}
                    y={y((d as any)[combiOption])}
                    width={x.bandwidth()}
                    height={graphHeight - y((d as any)[combiOption])}
                    fill={UNDPColorModule.categoricalColors.colors[0]}
                    opacity={0.8}
                  />
                  <text
                    className='barLabel'
                    x={x(d.year)}
                    dx={x.bandwidth() / 2}
                    y={y((d as any)[combiOption]) - 5}
                  >
                    {`${Math.round((d as any)[combiOption])}${
                      totalPercentOption === 'percentage' ? '%' : ''
                    }`}
                  </text>
                </g>
              ))}
            </g>
            <line
              x1={0}
              y1={graphHeight}
              x2={graphWidth}
              y2={graphHeight}
              stroke='#232E3D'
              strokeWidth={2}
            />
          </g>
          <text
            x={-graphHeight / 2}
            y='20'
            transform='rotate(-90)'
            textAnchor='middle'
          >
            {totalPercentOption === 'percentage'
              ? 'Percentage of countries'
              : 'Number of countries'}
          </text>
        </svg>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
