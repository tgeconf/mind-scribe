import '../../assets/style/canvas.scss';
import React from 'react';
import BlockSelector from './blockSelector';
import { ICoord } from '../ds';

interface ICanvasState {
    showBlockSelector: boolean
    blockSelectorPosi: ICoord
}

export default class Canvas extends React.Component<{}, ICanvasState> {
    constructor(props: any) {
        super(props);
    }

    state = {
        showBlockSelector: false,
        blockSelectorPosi: { x: 0, y: 0 }
    }

    getSelectorRes(res: boolean) {
        this.setState({
            showBlockSelector: res
        })
    }

    render() {
        const handleDblClick = (e: any) => {
            new Promise((resolve, reject) => {
                this.setState({
                    showBlockSelector: false
                })
                resolve();
            }).then(() => {
                this.setState({
                    showBlockSelector: true,
                    blockSelectorPosi: {
                        x: e.clientX - BlockSelector.selectorW / 2,
                        y: e.clientY - BlockSelector.selectorH / 2
                    }
                })
            })
        }

        const bSelector: JSX.Element | null = this.state.showBlockSelector ?
            <BlockSelector posi={this.state.blockSelectorPosi} val={''} showSelector={this.getSelectorRes.bind(this)}></BlockSelector> :
            null
        return (
            <div>
                <svg id='canvasSvg' className='canvas-svg' onDoubleClick={(e) => { handleDblClick(e) }}></svg>
                {bSelector}
            </div>
        )
    }
}