import React, { useEffect } from 'react';
import * as d3 from "d3";

const PieChart = (props) => {

    let width = props.width ? props.width : 250;
    let height = props.height ? props.height : 250;
    let radius = Math.min(width, height) / 2;

    useEffect(() => {
        if (props.chartData) {
            let element = document.getElementById('donut-chart')
            if (document.getElementById('pieChart_svg'))
                element.removeChild(document.getElementById('pieChart_svg'))

            plotChart(element, props.chartData.data, props.chartData.colorArray, props.chartData.fontColor)
        }
    }, [props.chartData])

    function plotChart(element, data, colorArray, fontColor) {
        let svg = d3.select(element)
            .append("svg")
            .attr("id", "pieChart_svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

        let color = d3.scaleOrdinal()
            .range(colorArray);

        let pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.value; })

        let data_ready = pie(d3.entries(data))

        let arc = d3.arc()
            .innerRadius(radius * (props.isLAS ? 0.57 : 0.5))
            .outerRadius(radius * 0.8)

        let outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

        svg
            .selectAll('allSlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d) { return (color(d.data.key)) })
            .attr("stroke", "white")
            .style("stroke-width", "0px")
            .style("opacity", 1)
            .style("cursor", props.noLabel ? "default" : "pointer")
            .on('click', function (d) {
                onClickLabel(d)
            })

        if (!props.noLabel) {
            svg
                .selectAll('allPolylines')
                .data(data_ready)
                .enter()
                .append('polyline')
                .attr("stroke", fontColor)
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function (d) {
                    let posA = arc.centroid(d)
                    let posB = outerArc.centroid(d)
                    let posC = outerArc.centroid(d);
                    let midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2)
                    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                    return [posA, posB, posC]
                })

            svg
                .selectAll('allLabels')
                .data(data_ready)
                .enter()
                .append('text')
                .style('font', '12px times')
                .style("font-family", "OpenSans-Regular")
                .attr('stroke', fontColor)
                .text(function (d) { let dispLabel = `${d.data.key} : ${d.data.value}`; return dispLabel; })
                .attr('transform', function (d) {
                    let pos = outerArc.centroid(d);
                    let midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2)
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function (d) {
                    let midangle = d.startAngle + ((d.endAngle - d.startAngle) / 2)
                    return (midangle < Math.PI ? 'start' : 'end')
                })
        }
    }

    function onClickLabel(label) {
        props.onClickLabelCB && props.onClickLabelCB(label.data)
    }

    return (
        <div id="donut-chart">
        </div>
    )
}

export default PieChart;