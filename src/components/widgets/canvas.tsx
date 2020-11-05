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
    static CANVAS_BG_ID: string = 'canvasBg';

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
                const canvasBg: HTMLElement | null = document.getElementById(Canvas.CANVAS_BG_ID);
                const offsetX: number = canvasBg ? canvasBg.offsetLeft : 0;
                const offsetY: number = canvasBg ? canvasBg.offsetTop : 0;
                console.log('test: ', offsetX, offsetY, canvasBg?.offsetTop);
                this.setState({
                    showBlockSelector: true,
                    blockSelectorPosi: {
                        x: e.clientX - BlockSelector.selectorW / 2 - offsetX,
                        y: e.clientY - BlockSelector.selectorH / 2 - offsetY
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
            <div id={Canvas.CANVAS_BG_ID} className='canvas-bg' onDoubleClick={(e) => { handleDblClick(e) }}>
                {bSelector}
                {renderedBlocks}
            </div>
        )
    }
}