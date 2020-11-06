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
    mouseMoving: boolean
    mouseMovingPosi: ICoord
}

export default class Block extends React.Component<IBlockProps, BlockState> {
    static BLOCK_TYPES: string[] = ['code', 'text'];
    static BLOCK_SIZES: Map<string, ISize> = new Map([
        [Block.BLOCK_TYPES[0], { w: 200, h: 200 }],
        [Block.BLOCK_TYPES[1], { w: 300, h: 50 }]
    ])

    constructor(props: any) {
        super(props);
        if (Block.BLOCK_TYPES.includes(props.blockType)) {
            this.state = {
                blockPosi: props.posi,
                blockSize: typeof Block.BLOCK_SIZES.get(props.blockType) !== 'undefined' ? Block.BLOCK_SIZES.get(props.blockType) : { w: 0, h: 0 },
                blockType: props.blockType,
                blockContent: '',
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
        console.log('moving', this.state.mouseMoving);
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

    handleMonacoOnChange(newVal: string, e: any) {
        console.log('onChange', newVal, e);
    }

    handleMonacoDidMount(editor: any, monaco: any) {
        console.log('editorDidMount', editor);
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
                        width={typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.w : 0}
                        height={typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.h : 0}
                        language="json"
                        theme="vs-dark"
                        value={this.state.blockContent}
                        options={options}
                        onChange={this.handleMonacoOnChange}
                        
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
            }}>
                {blockInnerContainer}
                {/* <div className='cover'
                    onMouseDown={(e) => { this.handleMouseDown(e) }}
                    onMouseMove={(e) => { this.handleMouseMove(e) }}
                    onMouseUp={(e) => { this.handleMouseUp(e) }}></div> */}
            </div>
        )
    }
}