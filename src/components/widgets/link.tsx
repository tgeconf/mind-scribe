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
    render() {
        return (
            <line x1={this.state.startPnt.x} y1={this.state.startPnt.y} x2={this.state.endPnt.x} y2={this.state.endPnt.y} style={{ stroke: '#f3f3f3f2', strokeWidth: 3 }}></line>
        )
    }
}