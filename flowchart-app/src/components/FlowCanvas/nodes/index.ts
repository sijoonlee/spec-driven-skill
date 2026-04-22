import ProcessNode from './ProcessNode'
import DecisionNode from './DecisionNode'
import TerminatorNode from './TerminatorNode'
import IONode from './IONode'

export const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  terminator: TerminatorNode,
  io: IONode,
}
