import { put, select } from 'redux-saga/effects';
import { expectSaga } from '../../../src';
import { errorRegex, unreachableError } from './_helper';

const storeState = {
  data: {
    foo: 'bar',
  },
};

function getData(state) {
  return state.data;
}

function* saga() {
  const data = yield select(getData);
  yield put({ type: 'DATA', payload: data });
}

test('select assertion passes', () => (
  expectSaga(saga)
    .withState(storeState)
    .select(getData)
    .run()
));

test('put assertion passes', () => (
  expectSaga(saga)
    .withState(storeState)
    .put({ type: 'DATA', payload: storeState.data })
    .run()
));

test('select assertion fails with wrong function', () => (
  expectSaga(saga)
    .withState(storeState)
    .select(state => state.data)
    .run()
    .then(unreachableError)
    .catch((e) => {
      expect(e.message).toMatch(errorRegex);
    })
));

test('put assertion fails with wrong payload', () => (
  expectSaga(saga)
    .withState(storeState)
    .put({ type: 'DATA', payload: 'hello' })
    .run()
    .then(unreachableError)
    .catch((e) => {
      expect(e.message).toMatch(errorRegex);
    })
));
