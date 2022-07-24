import { useEffect, useReducer } from 'react'
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
  currentOperand: string | null
  previousOperand: string | null
  operation: string | undefined
  overwrite: boolean
}

export type Action = {
  type: ACTIONS
  payload: {
    digit: string
    operation?: string
  }
}

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state
      }
      if (payload.digit === '.' && state.currentOperand?.includes('.')) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: '',
        currentOperand: evaluate(state),
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.CLEAR:
      return {} as State
    default:
      return state
  }
}

const evaluate = ({ currentOperand, previousOperand, operation }: State) => {
  const prev = parseFloat(previousOperand as string)
  const current = parseFloat(currentOperand as string)
  if (isNaN(prev) || isNaN(current)) {
    return ''
  }
  let computation = 0
  switch (operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break
    case '/':
      computation = prev / current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

const formatOperand = (operand: string | null) => {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) {
    return INTEGER_FORMATTER.format(+integer)
  }
  return `${INTEGER_FORMATTER.format(+integer)}.${decimal}`
}

const App = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {} as State
  )

  const OPERATIONS: Array<string> = ['/', '*', '+', '-']

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (OPERATIONS.find((el) => el === e.key)) {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: e.key, digit: '' } })
      } else if (e.key == '.' || 0 <= +e.key || +e.key <= 9) {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: e.key } })
      } else if (e.key == 'Backspace') {
        dispatch({ type: ACTIONS.CLEAR, payload: { digit: '' } })
      } else if (e.key == '=') {
        dispatch({ type: ACTIONS.EVALUATE, payload: { digit: '' } })
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button
        className='span-two'
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR, payload: { digit: '' } })
        }}>
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: ACTIONS.DELETE_DIGIT, payload: { digit: '' } })
        }}>
        DEL
      </button>
      <OperationButton symbol='÷' operation='/' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton symbol='x' operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton symbol='+' operation='+' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton symbol='-' operation='-' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <button
        className='span-two'
        onClick={() => {
          dispatch({ type: ACTIONS.EVALUATE, payload: { digit: '' } })
        }}>
        =
      </button>
    </div>
  )
}

export default App
