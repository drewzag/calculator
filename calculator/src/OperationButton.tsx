import { Action, ACTIONS } from './App'

type Props = {
  dispatch: (action: Action) => void
  operation: string
  symbol: string
}

export const OperationButton: React.FC<Props> = ({ dispatch, operation, symbol }) => {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation, digit: '' } })
      }>
      {symbol}
    </button>
  )
}
