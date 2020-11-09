import '../../assets/style/blockSelector.scss';
import React from 'react';
import { ICoord } from '../ds';

interface BlockSelectorProps {
    posi: ICoord
    val: string
    showBSelector: (res: boolean) => void
    addBlock: (posi: ICoord, type: string) => void
}

interface BlockSelectorState {
    val: string
    size: number
}

export default class BlockSelector extends React.Component<BlockSelectorProps, BlockSelectorState> {
    static selectorH: number = 20;
    static selectorW: number = 2;

    constructor(props: any) {
        super(props);
    }

    state = {
        val: this.props.val,
        size: 0
    }

    updateCanvasShowBSelector(show: boolean) {
        this.props.showBSelector(show);
    }

    addCanvasBlock(posi: ICoord, type: string) {
        this.props.addBlock(posi, type);
    }

    render() {
        const changeVal = (e: any) => {
            this.setState({
                val: e.target.value,
                size: e.target.value.length
            })
        }

        return (
            <div>
                <input
                    className='block-selector'
                    style={{ left: this.props.posi.x, top: this.props.posi.y, width: this.state.size * 7 + 2 }}
                    onChange={(e) => { changeVal(e) }}
                    value={this.state.val}
                    autoFocus={true}
                    onBlur={(e) => { this.updateCanvasShowBSelector(false) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { this.addCanvasBlock(this.props.posi, this.state.val) } }}
                ></input>
            </div>
        )
    }
}