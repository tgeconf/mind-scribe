import React from 'react';
import { ICoord } from '../ds';

export interface LinkProps {
    startBlockId: number
    endBlockId: number
    startPnt: ICoord
    endPnt: ICoord
}

interface LinkState {
    startBlockId: number
    endBlockId: number
    startPnt: ICoord
    endPnt: ICoord
}

export default class Link extends React.Component<LinkProps, LinkState> {
    state = {
        startBlockId: 0,
        endBlockId: 1,
        startPnt: this.props.startPnt,
        endPnt: this.props.endPnt
    }

    screenToSvg(screenCoord: ICoord) {
        const svg: any = document.getElementById('svgContainer');
        // const svgOri: any = document.getElementById('svgOri');
        const point = svg.createSVGPoint();
        point.x = screenCoord.x;
        point.y = screenCoord.y;
        const CTM = svg.getScreenCTM();
        point.matrixTransform(CTM.inverse());
        return point;
    }

    render() {
        return (
            <line
                x1={this.screenToSvg(this.props.startPnt).x}
                y1={this.screenToSvg(this.props.startPnt).y}
                x2={this.screenToSvg(this.props.endPnt).x}
                y2={this.screenToSvg(this.props.endPnt).y}
                style={{ stroke: '#000', strokeWidth: 3 }}></line>
            // style = {{ stroke: '#f3f3f3f2', strokeWidth: 3 }}></line>
        )
    }
}