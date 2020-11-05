import '../../assets/style/canvas.scss';
import React from 'react';
import BlockSelector from './blockSelector';
import { ICoord } from '../ds';
import Block, { IBlockProps } from './block';

interface ICanvasState {
    showBlockSelector: boolean
    blockSelectorPosi: ICoord
    blocks: IBlockProps[]
}

export default class Canvas extends React.Component<{}, ICanvasState> {
    constructor(props: any) {
        super(props);
    }

    state = {
        showBlockSelector: false,
        blockSelectorPosi: { x: 0, y: 0 },
        blocks: []
    }

    showBSelector(show: boolean) {
        this.setState({
            showBlockSelector: show
        })
    }

    getSelectorRes(posi: ICoord, type: string) {
        this.setState({
            showBlockSelector: false,
            blocks: [...this.state.blocks, {
                posi: posi,
                blockType: type,
                blockContent: ''
            }]
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
            <BlockSelector
                posi={this.state.blockSelectorPosi}
                val={''}
                showBSelector={this.showBSelector.bind(this)}
                addBlock={this.getSelectorRes.bind(this)}
            ></BlockSelector> : null

        const renderedBlocks: JSX.Element[] = this.state.blocks.map((bProps: IBlockProps, idx: number) => {
            return <Block posi={bProps.posi} blockType={bProps.blockType} blockContent={bProps.blockContent}></Block>
        })
        return (
            <div>
                <svg id='canvasSvg' className='canvas-svg' onDoubleClick={(e) => { handleDblClick(e) }}></svg>
                {bSelector}
                {renderedBlocks}
            </div>
        )
    }
}