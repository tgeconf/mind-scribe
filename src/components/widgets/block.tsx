import '../../assets/style/block.scss';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { ICoord, ISize } from '../ds';
import Canvas from './canvas';
import BlockSelector from './blockSelector';

export interface BlockProps {
    id: number
    posi: ICoord
    blockType: string
    blockContent: string
    deleteBlock: (blockId: number) => void
    addLink: (startBId: number, endBId: number, startPnt: ICoord, endPnt: ICoord) => void
    updateLastLink: (endPnt: ICoord) => void
}

interface BlockState {
    diffPosi: ICoord
    blockSize: ISize | undefined
    blockType: string
    blockContent: string | null
    mouseMoving: boolean
    mouseMovingPosi: ICoord
    showAnchors: boolean[]
}

export default class Block extends React.Component<BlockProps, BlockState> {
    static BLOCK_PADDING: number = 6;
    static BLOCK_TYPES: string[] = ['code', 'text'];
    static BLOCK_SIZES: Map<string, ISize> = new Map([
        [Block.BLOCK_TYPES[0], { w: 500, h: 300 }],
        [Block.BLOCK_TYPES[1], { w: 300, h: 260 }]
    ])
    monacoRef: any;

    constructor(props: any) {
        super(props);
        console.log('constructuing', this.props.posi);
        this.monacoRef = React.createRef();
        if (Block.BLOCK_TYPES.includes(props.blockType)) {
            this.state = {
                diffPosi: { x: 0, y: 0 },
                blockSize: typeof Block.BLOCK_SIZES.get(props.blockType) !== 'undefined' ? Block.BLOCK_SIZES.get(props.blockType) : { w: 0, h: 0 },
                blockType: props.blockType,
                blockContent: null,
                mouseMoving: false,
                mouseMovingPosi: { x: 0, y: 0 },
                showAnchors: [false, false, false, false]
            }
        }
    }

    // componentDidMount(){
    //     document.onmousemove = (e:any)=>{
    //         this.handleCoverMouseMove(e);
    //     }
    // }

    handleCoverMouseDown(e: any) {
        e.target.classList.add('grabbing');
        this.setState({
            mouseMoving: true,
            mouseMovingPosi: { x: e.clientX, y: e.clientY }
        }, () => {
            document.onmousemove = (e: any) => {
                this.handleCoverMouseMove(e);
            }
            document.onmouseup = (e: any) => {
                this.handleCoverMouseUp(e);
            }
        })

    }

    handleCoverMouseMove(e: any) {
        if (this.state.mouseMoving) {
            const tmpX: number = e.clientX;
            const tmpY: number = e.clientY;
            const diffX: number = tmpX - this.state.mouseMovingPosi.x;
            const diffY: number = tmpY - this.state.mouseMovingPosi.y;
            this.setState({
                diffPosi: {
                    x: this.state.diffPosi.x + diffX,
                    y: this.state.diffPosi.y + diffY
                },
                mouseMovingPosi: {
                    x: tmpX,
                    y: tmpY
                }
            })
        }
    }

    handleCoverMouseUp(e: any) {
        e.target.classList.remove('grabbing');
        this.setState({
            mouseMoving: false
        }, () => {
            document.onmousemove = null;
            document.onmouseup = null;
        })
    }

    handleContainerMouseMove(e: any) {
        const respondW: number = 20;
        const blockSize: ISize = typeof this.state.blockSize === 'undefined' ? { w: 0, h: 0 } : this.state.blockSize;
        const blockX1: number = this.props.posi.x + this.state.diffPosi.x;
        const blockY1: number = this.props.posi.y + this.state.diffPosi.y;
        const blockX2: number = blockX1 + blockSize.w;
        const blockY2: number = blockY1 + blockSize.h;
        let showAnchors: boolean[] = [];
        showAnchors.fill(false);
        const canvasBg: HTMLElement | null = document.getElementById(Canvas.CANVAS_BG_ID);
        const offsetX: number = canvasBg ? canvasBg.offsetLeft : 0;
        const offsetY: number = canvasBg ? canvasBg.offsetTop : 0;
        const mouseX: number = e.clientX - BlockSelector.selectorW / 2 - offsetX;
        const mouseY: number = e.clientY - BlockSelector.selectorH / 2 - offsetY;
        // console.log(mouseX, blockX1, blockX1 + respondW);
        const anchorSize: number = 10;
        if ((mouseX >= blockX1 - 2 && mouseX <= blockX1 + respondW && mouseY >= blockY1 && mouseY <= blockY2) ||
            (mouseX >= blockX1 - anchorSize && mouseX <= blockX1 && mouseY >= (blockY1 + blockSize.h / 2 - anchorSize) && mouseY <= (blockY1 + blockSize.h / 2 + anchorSize))) {
            showAnchors[3] = true;
        } else if ((mouseX >= blockX2 - respondW + Block.BLOCK_PADDING * 2 && mouseX <= blockX2 + 2 + Block.BLOCK_PADDING * 2 && mouseY >= blockY1 && mouseY <= blockY2) ||
            (mouseX >= blockX2 + Block.BLOCK_PADDING * 2 && mouseX <= blockX2 + anchorSize + Block.BLOCK_PADDING * 2 && mouseY >= (blockY1 + blockSize.h / 2 - anchorSize) && mouseY <= (blockY1 + blockSize.h / 2 + anchorSize))) {
            showAnchors[1] = true;
        } else if ((mouseY >= blockY1 - Block.BLOCK_PADDING * 2 - 2 && mouseY <= blockY1 + respondW - Block.BLOCK_PADDING * 2 && mouseX >= blockX1 && mouseX <= blockX2) ||
            (mouseY >= blockY1 - anchorSize - Block.BLOCK_PADDING * 2 && mouseY <= blockY1 + 2 - Block.BLOCK_PADDING * 2 && mouseX >= (blockX1 + blockSize.w / 2 - anchorSize) && mouseX <= (blockX1 + blockSize.w / 2 + anchorSize))) {
            showAnchors[0] = true;
        } else if ((mouseY >= blockY2 - respondW && mouseY <= blockY2 + 2 && mouseX >= blockX1 && mouseX <= blockX2) ||
            (mouseY >= blockY2 && mouseY <= blockY2 + anchorSize && mouseX >= (blockX1 + blockSize.w / 2 - anchorSize) && mouseX <= (blockX1 + blockSize.w / 2 + anchorSize))) {
            showAnchors[2] = true;
        }
        this.setState({
            showAnchors: showAnchors
        })
    }

    handleContainerMouseLeave(e: any) {
        this.setState({
            showAnchors: ([] as boolean[]).fill(false)
        })
    }

    handleKeyDown(e: any) {
        console.log(e.key, this);
        switch (e.key) {
            case 'Delete':
                this.props.deleteBlock(this.props.id);
                break;
            default:
                break;
        }
    }

    handleMonacoOnChange(newVal: string, e: any) {
        const tmpValue: string = this.monacoRef.current.editor.getValue();
        if (tmpValue.replaceAll(/\r\n/gi, '').length > 0) {
            this.setState({
                blockContent: tmpValue
            })
        }
    }

    handleMonacoDidMount(editor: any, monaco: any) {
        // console.log('editorDidMount', editor);
        // editor.setPosition({ lineNumber: 0, column: 0 });
        // editor.focus();
    }

    handleMouseDownAnchor(type: number, e: any) {
        this.props.addLink(0, 1, { x: e.clientX, y: e.clientY }, { x: e.clientX, y: e.clientY });
        document.onmousemove = (e) => {
            this.handleMouseMoveAnchor(e);
        }
        document.onmouseup = (e) => {
            this.handleMouseUpAnchor(e);
        }
    }

    handleMouseMoveAnchor(e: any) {
        this.props.updateLastLink({ x: e.clientX, y: e.clientY });
    }

    handleMouseUpAnchor(e: any) {
        document.onmousemove = null;
        document.onmouseup = null;
    }

    render() {
        //generate block content
        let blockInnerContainer: JSX.Element = <div className='block-inner-container'></div>;
        switch (this.state.blockType) {
            case Block.BLOCK_TYPES[0]:
                const options = {
                    selectOnLineNumbers: true
                };
                blockInnerContainer = <div className='block-inner-container'>
                    <MonacoEditor
                        ref={this.monacoRef}
                        width={typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.w : 0}
                        height={typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.h : 0}
                        language="json"
                        theme="vs-light"
                        value={this.state.blockContent}
                        options={options}
                        onChange={this.handleMonacoOnChange.bind(this)}
                        editorDidMount={this.handleMonacoDidMount.bind(this)}
                    />
                </div>
                break;

            default:
                <div className='block-inner-container'>{this.state.blockContent}</div>
                break;
        }
        return (
            <div className='block-container'
                tabIndex={this.props.id}
                style={{
                    top: this.state.diffPosi.y + this.props.posi.y,
                    left: this.state.diffPosi.x + this.props.posi.x,
                    width: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.w : 0,
                    height: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.h : 0
                }}
                onKeyDown={(e) => { this.handleKeyDown(e) }}
                onMouseMove={(e) => { this.handleContainerMouseMove(e) }}
                onMouseLeave={(e) => { this.handleContainerMouseLeave(e) }}>
                <div className='title-container' onMouseDown={(e) => { this.handleCoverMouseDown(e) }}>
                    <p>{this.state.blockType}</p>
                </div>
                <div className={'anchor-pnt a-top ' + (this.state.showAnchors[0] ? 'hover-a-top' : '')} onMouseDown={(e) => { this.handleMouseDownAnchor(0, e) }}></div>
                <div className={'anchor-pnt a-right ' + (this.state.showAnchors[1] ? 'hover-a-right' : '')} onMouseDown={(e) => { this.handleMouseDownAnchor(1, e) }}></div>
                <div className={'anchor-pnt a-bottom ' + (this.state.showAnchors[2] ? 'hover-a-bottom' : '')} onMouseDown={(e) => { this.handleMouseDownAnchor(2, e) }}></div>
                <div className={'anchor-pnt a-left ' + (this.state.showAnchors[3] ? 'hover-a-left' : '')} onMouseDown={(e) => { this.handleMouseDownAnchor(3, e) }}></div>
                <div className='cover'></div>
                { blockInnerContainer}
            </div >
        )
    }
}