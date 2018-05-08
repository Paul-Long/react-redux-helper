import invariant from 'invariant';
import prefixType from './prefixType';

export default function prefixedDispatch(dispath, model) {
  return (action) => {
    const { type } = action;
    invariant(type, 'dispatch: action should be plain Object with type');
    return dispath({ ...action, type: prefixType(type, model) });
  };
}
