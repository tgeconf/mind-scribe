import '../../assets/style/canvas.scss';
import React from 'react';
import BlockSelector from './blockSelector';
import { ICoord } from '../ds';
import Block, { BlockProps } from './block';
import Link, { LinkProps } from './link';

interface CanvasState {
    showBlockSelector: boolean
    blockSelectorPosi: ICoord
    blocks: BlockProps[]
    links: LinkProps[]
    deletedBlocks: number[]
    mousePressed: boolean
}

export default class Canvas extends React.Component<{}, CanvasState> {
    static CANVAS_BG_ID: string = 'canvasBg';

    constructor(props: any) {
        super(props);
    }

    state = {
        showBlockSelector: false,
        blockSelectorPosi: { x: 0, y: 0 },
        blocks: [],
        links: [],
        focusedBlock: '',
        deletedBlocks: [],
        mousePressed: false
    }

    showBSelector(show: boolean) {
        this.setState({
            showBlockSelector: show
        })
    }

    getSelectorRes(posi: ICoord, type: string) {
        const len: number = this.state.blocks.length;
        this.setState({
            showBlockSelector: false,
            blocks: [...this.state.blocks, {
                id: len,
                posi: posi,
                blockType: type,
                blockContent: '',
                deleteBlock: (str: number) => { },
                addLink: this.addLink.bind(this),
                updateLastLink: this.updateLastLink.bind(this)
            }]
        })
    }

    addLink(startBId: number, endBId: number, startPnt: ICoord, endPnt: ICoord) {
        this.setState({
            links: [...this.state.links, {
                startBlockId: startBId,
                endBlockId: endBId,
                startPnt: startPnt,
                endPnt: endPnt
            }]
        })
    }

    updateLastLink(endPnt: ICoord) {
        const tmpLinks: LinkProps[] = this.state.links;
        tmpLinks[tmpLinks.length - 1].endPnt = endPnt;
        console.log('updateing last link: ', endPnt, tmpLinks);
        this.setState({
            links: tmpLinks
        })
    }

    delBlock(blockId: number) {
        this.setState({
            deletedBlocks: [...this.state.deletedBlocks, blockId]
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
                addBlock={this.getSelectorRes.bind(this)}></BlockSelector> : null

        const renderedBlocks: (JSX.Element | null)[] = this.state.blocks.map((bProps: BlockProps, idx: number) => {
            if (!this.state.deletedBlocks.includes(bProps.id as never)) {
                return <Block
                    id={bProps.id}
                    posi={bProps.posi}
                    blockType={bProps.blockType}
                    blockContent={bProps.blockContent}
                    deleteBlock={this.delBlock.bind(this)}
                    addLink={bProps.addLink}
                    updateLastLink={bProps.updateLastLink}></Block>
            }
            return null;
        })

        const renderedLinks: (JSX.Element | null)[] = this.state.links.map((lProps: LinkProps, idx: number) => {
            if (!this.state.deletedBlocks.includes(lProps.startBlockId as never) && !this.state.deletedBlocks.includes(lProps.endBlockId as never)) {
                console.log('rendering: ', lProps.endPnt);
                return <Link
                    startBlockId={lProps.startBlockId}
                    endBlockId={lProps.endBlockId}
                    startPnt={lProps.startPnt}
                    endPnt={lProps.endPnt}></Link>
            }
            return null;
        })
        return (
            <div id={Canvas.CANVAS_BG_ID} className='canvas-bg' onDoubleClick={(e) => { handleDblClick(e) }}>
                <svg id='svgContainer'>
                    <circle id='svgOri' cx='0' cy='0' r='0.1'></circle>
                    {renderedLinks}
                </svg>
                {bSelector}
                {renderedBlocks}
            </div>
        )
    }
}