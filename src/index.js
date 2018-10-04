import Block from './Block'
import DynamicBlock from './DynamicBlock'


function block(data) {
    return new Block(data)
}

function dynamicBlock(data) {
    return new DynamicBlock(data)
}

export {
    block,
    dynamicBlock,
}
