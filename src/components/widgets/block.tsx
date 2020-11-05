import '../../assets/style/block.scss';
import React from 'react';
import { ICoord, ISize } from '../ds';
import { start } from 'repl';

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

    render() {
        const handleMouseDown = (e: any) => {
            e.target.classList.add('grabbing');
            this.setState({
                mouseMoving: true,
                mouseMovingPosi: { x: e.clientX, y: e.clientY }
            })
        }

        const handleMouseMove = (e: any) => {
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

        const handleMouseUp = (e: any) => {
            e.target.classList.remove('grabbing');
            this.setState({
                mouseMoving: false
            })
        }

        return (
            <div className='block-container' style={{
                top: this.state.blockPosi.y,
                left: this.state.blockPosi.x,
                width: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.w : 0,
                height: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.h : 0
            }}>
                {this.state.blockType}
                <div className='cover'
                    onMouseDown={(e) => { handleMouseDown(e) }}
                    onMouseMove={(e) => { handleMouseMove(e) }}
                    onMouseUp={(e) => { handleMouseUp(e) }}></div>
            </div>
        )
    }
}