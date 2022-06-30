import { useReducer } from 'react'
import './App.css'
import { DigitButton } from './DigitButton'
import { OperationButton } from './OperationButton'

export enum ACTIONS {
  ADD_DIGIT = 'add-digit',
  CHOOSE_OPERATION = 'choose-operation',
  CLEAR = 'clear',
  DELETE_DIGIT = 'delete-digit',
  EVALUATE = 'evaluate',
}

export type State = {
  currentOperand: string
  previousOperand: string
  operation: number
}

export type Action = {
  type: ACTIONS
  payload: {
    digit?: string
    operation?: string
  }
}

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }
    default:
      return state
  }
}

const App = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {} as State
  )

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>
          {previousOperand} {operation}
        </div>
        <div className='current-operand'>{currentOperand}</div>
      </div>
      <button className='span-two'>AC</button>
      <button>DEL</button>
      <OperationButton operation='/' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button className='span-two'>=</button>
    </div>
  )
}

export default App
