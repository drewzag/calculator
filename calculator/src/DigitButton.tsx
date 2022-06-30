import { Action, ACTIONS } from './App'

type Props = {
  dispatch: (action: Action) => void
  digit: string
}

export const DigitButton: React.FC<Props> = ({ dispatch, digit }) => {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
      {digit}
    </button>
  )
}
