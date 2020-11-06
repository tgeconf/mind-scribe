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
        console.log('constructuing', this.props.posi);
        this.monacoRef = React.createRef();
        if (Block.BLOCK_TYPES.includes(props.blockType)) {
            this.state = {
                diffPosi: { x: 0, y: 0 },
                blockSize: typeof Block.BLOCK_SIZES.get(props.blockType) !== 'undefined' ? Block.BLOCK_SIZES.get(props.blockType) : { w: 0, h: 0 },
                blockType: props.blockType,
                blockContent: '',
                covering: true,
                mouseMoving: false,
                mouseMovingPosi: { x: 0, y: 0 }
            }
        }
    }

    componentDidMount() {
        console.log('component mount');
        // this.addEventListener('keydown', this.handleKeyDown.bind(this));
        // document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    componentDidUpdate() {
        console.log('component update');
    }

    handleCoverMouseDown(e: any) {
        e.target.classList.add('grabbing');
        this.setState({
            mouseMoving: true,
            mouseMovingPosi: { x: e.clientX, y: e.clientY }
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
        })
    }

    handleCoverDblClick(e: any) {
        this.setState({
            covering: false
        }, () => {
            console.log('callback', this.monacoRef.current.editor);
            this.monacoRef.current.editor.focus();
        })
    }

    handleBlur(e: any) {
        this.setState({
            covering: true
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
                        editorDidMount={this.handleMonacoDidMount.bind(this)}
                    />
                </div>
                break;

            default:
                <div className='block-inner-container'>{this.state.blockContent}</div>
                break;
        }
        console.log('rednering', this.props.id, this.state.diffPosi);
        return (
            <div className='block-container'
                tabIndex={this.props.id}
                style={{
                    top: this.state.diffPosi.y + this.props.posi.y,
                    left: this.state.diffPosi.x + this.props.posi.x,
                    width: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.w : 0,
                    height: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.h : 0
                }}
                onBlur={(e) => { this.handleBlur(e) }}
                onKeyDown={(e) => { this.handleKeyDown(e) }}>
                { blockInnerContainer}
                <div className='cover'
                    onMouseDown={(e) => { this.handleCoverMouseDown(e) }}
                    onMouseMove={(e) => { this.handleCoverMouseMove(e) }}
                    onMouseUp={(e) => { this.handleCoverMouseUp(e) }}
                    onDoubleClick={(e) => { this.handleCoverDblClick(e) }}
                    style={{ display: this.state.covering ? '' : 'none' }}></div>
            </div>
        )
    }
}