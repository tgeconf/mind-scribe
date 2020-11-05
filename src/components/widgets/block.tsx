import '../../assets/style/block.scss';
import React from 'react';
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
                blockContent: ''
            }
        }
    }

    // state = {
    //     blockPosi: { x: 0, y: 0 },
    //     blockSize: { w: 0, h: 0 },
    //     blockType: ''
    // }

    render() {
        return (
            <div className='block-container' style={{
                top: this.state.blockPosi.y,
                left: this.state.blockPosi.x,
                width: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.w : 0,
                height: typeof this.state.blockSize !== 'undefined' ? this.state.blockSize.h : 0
            }}>
                {this.state.blockType}
            </div>
        )
    }
}