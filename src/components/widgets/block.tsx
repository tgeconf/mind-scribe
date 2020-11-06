import '../../assets/style/block.scss';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { ICoord, ISize } from '../ds';

export interface IBlockProps {
    posi: ICoord
    blockType: string
    blockContent: string
}

interface BlockState {
    blockPosi: ICoord
    blockSize: ISize | undefined
    blockType: string
    blockContent: string
    covering: boolean
    mouseMoving: boolean
    mouseMovingPosi: ICoord
}

export default class Block extends React.Component<IBlockProps, BlockState> {
    static BLOCK_TYPES: string[] = ['code', 'text'];
    static BLOCK_SIZES: Map<string, ISize> = new Map([
        [Block.BLOCK_TYPES[0], { w: 500, h: 300 }],
        [Block.BLOCK_TYPES[1], { w: 300, h: 50 }]
    ])
    monacoRef: any;

    constructor(props: any) {
        super(props);
        this.monacoRef = React.createRef();
        if (Block.BLOCK_TYPES.includes(props.blockType)) {
            this.state = {
                blockPosi: props.posi,
                blockSize: typeof Block.BLOCK_SIZES.get(props.blockType) !== 'undefined' ? Block.BLOCK_SIZES.get(props.blockType) : { w: 0, h: 0 },
                blockType: props.blockType,
                blockContent: '',
                covering: true,
                mouseMoving: false,
                mouseMovingPosi: { x: 0, y: 0 }
            }
        }
    }

    // state = {
    //     blockPosi: { x: 0, y: 0 },
    //     blockSize: { w: 0, h: 0 },
    //     blockType: ''
    // }
    handleMouseDown(e: any) {
        e.target.classList.add('grabbing');
        this.setState({
            mouseMoving: true,
            mouseMovingPosi: { x: e.clientX, y: e.clientY }
        })
    }

    handleMouseMove(e: any) {
        if (this.state.mouseMoving) {
            const tmpX: number = e.clientX;
            const tmpY: number = e.clientY;
            const diffX: number = tmpX - this.state.mouseMovingPosi.x;
            const diffY: number = tmpY - this.state.mouseMovingPosi.y;
            this.setState({
                blockPosi: {
                    x: this.state.blockPosi.x + diffX,
                    y: this.state.blockPosi.y + diffY
                },
                mouseMovingPosi: {
                    x: tmpX,
                    y: tmpY
                }
            })
        }
    }

    handleMouseUp(e: any) {
        e.target.classList.remove('grabbing');
        this.setState({
            mouseMoving: false
        })
    }

    handleDblClick(e: any) {
        this.setState({
            covering: false
        })
    }

    handleBlur(e: any) {
        this.setState({
            covering: true
        })
    }

    handleMonacoOnChange(newVal: string, e: any) {
        this.setState({
            blockContent: this.monacoRef.current.editor.getValue()
        })
    }

    handleMonacoDidMount(editor: any, monaco: any) {
        // console.log('editorDidMount', editor);
        editor.focus();
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
                        theme="vs-lightdsa"
                        value={this.state.blockContent}
                        options={options}
                        onChange={this.handleMonacoOnChange.bind(this)}
                        editorDidMount={this.handleMonacoDidMount}
                    />
                </div>
                break;

            default:
                <div className='block-inner-container'>{this.state.blockContent}</div>
                break;
        }

        return (
            <div className='block-container' style={{
                top: this.state.blockPosi.y,
                left: this.state.blockPosi.x,
                width: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.w : 0,
                height: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.h : 0
            }} onBlur={(e) => { this.handleBlur(e) }}>
                {blockInnerContainer}
                <div className='cover'
                    onMouseDown={(e) => { this.handleMouseDown(e) }}
                    onMouseMove={(e) => { this.handleMouseMove(e) }}
                    onMouseUp={(e) => { this.handleMouseUp(e) }}
                    onDoubleClick={(e) => { this.handleDblClick(e) }}
                    style={{ display: this.state.covering ? '' : 'none' }}></div>
            </div>
        )
    }
}