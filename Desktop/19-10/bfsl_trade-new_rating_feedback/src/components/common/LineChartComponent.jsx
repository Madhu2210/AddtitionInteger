import React, { useEffect } from 'react'
import * as d3 from "d3";
import { convertCommaSeparated } from '../../common/CommonMethods';

const LineChartComponent = props => {

    useEffect(() => {
        let element = document.getElementById(props.eleId)
        element.innerHTML = ''
        plotChart(props.data, element, props.color, props.width, props.height)
    }, [props.data, props.color])

    function plotChart(data, element, color, width = 200, height = 70) {
        let parsedChartData = parseChartData(data)
        drawChart(parsedChartData, element, color, width, height)
    }

    function parseChartData(data) {
        let arr = [];
        for (let i in data) {
            let dateStr = ''
            // converting supported string format in all browsers to convert into date
            if (data[i].dt)
                dateStr = (data[i].dt).replace(/\s/, 'T')               
            arr.push({
                date: new Date(dateStr),                               
                value: +data[i].close                                   
            });
        }

        return arr;
    }

    function drawChart(data, element, color, width_s, height_s) {

        let svgWidth = width_s, svgHeight = height_s;
        let svg = d3.select(element)
        let margin = { top: 20, right: 20, bottom: 30, left: 50 };
        let width = svgWidth - margin.left - margin.right;
        let height = svgHeight - margin.top - margin.bottom;
        let bisectDate = d3.bisector(function (d) { return d.date; }).left;

        let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = d3.scaleTime().rangeRound([0, width]);

        let y = d3.scaleLinear().rangeRound([height, 0]);

        let line = d3.line()
            .x(function (d) {
                return x(d.date)
            })
            .y(function (d) {
                return y(d.value)
            })

        x.domain(d3.extent(data, function (d) {
            return d.date
        }));

        y.domain(d3.extent(data, function (d) {
            return d.value
        }));

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1)
            .attr("d", line);

        let focusLine = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focusLine.append("circle")
            .attr("r", 0.5);

        focusLine.append("rect")
            // .attr("width", "auto")
            .attr("height", 15)
            .attr("x", 2)
            .attr("y", 2)
            .attr("class", "rectborder")
            .attr("fill", "#0000FF");

        focusLine.append("text")
            .attr("x", 12)
            .attr("y", 12)
            .attr("dy", ".20em")
            .attr("font-size", "10px");

        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () { focusLine.style("display", null); })
            .on("mouseout", function () { focusLine.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            let x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            let qx = x(d.date);
            let qy = y(d.value);
            let qx1 = x(d.date) - 50;
            let qy1 = y(d.value) + 10;

            focusLine.select("circle").attr("transform", "translate(" + qx + "," + qy + ")");
            focusLine.select("rect").attr("transform", "translate(" + qx1 + "," + qy1 + ")");
            focusLine.select("text").attr("transform", "translate(" + qx1 + "," + qy1 + ")");
            focusLine.select("text").text(function () 
            { return convertCommaSeparated(d.value) + '  ,  ' + formatTime(d.date) });
            focusLine.select(".x-hover-line").attr("y2", height - y(d.value));
            focusLine.select(".y-hover-line").attr("x2", width + width);
        }
    }

    function formatTime(date) {
        if (date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            // let seconds = date.getSeconds();

            if (hours < 10)
                hours = '0' + hours
            if (minutes < 10)
                minutes = '0' + minutes
            // if (seconds < 10)
            //     seconds = '0' + seconds

            let strTime = hours + ':' + minutes;
            return strTime;
        }
        return ''
    }

    return (
        <svg className="line-chart" id={props.eleId}></svg>
    )
}

export default LineChartComponent;