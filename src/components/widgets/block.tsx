import '../../assets/style/block.scss';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { ICoord, ISize } from '../ds';

export interface IBlockProps {
    id: number
    posi: ICoord
    blockType: string
    blockContent: string
    deleteBlock: (blockId: number) => void
}

interface BlockState {
    diffPosi: ICoord
    blockSize: ISize | undefined
    blockType: string
    blockContent: string | null
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
        console.log('constructuing', this.props.posi);
        this.monacoRef = React.createRef();
        if (Block.BLOCK_TYPES.includes(props.blockType)) {
            this.state = {
                diffPosi: { x: 0, y: 0 },
                blockSize: typeof Block.BLOCK_SIZES.get(props.blockType) !== 'undefined' ? Block.BLOCK_SIZES.get(props.blockType) : { w: 0, h: 0 },
                blockType: props.blockType,
                blockContent: null,
                mouseMoving: false,
                mouseMovingPosi: { x: 0, y: 0 }
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
                onKeyDown={(e) => { this.handleKeyDown(e) }}>
                <div className='title-container' onMouseDown={(e) => { this.handleCoverMouseDown(e) }}>
                    <p>{this.state.blockType}</p>
                </div>
                <div className='cover'></div>
                { blockInnerContainer}
            </div>
        )
    }
}