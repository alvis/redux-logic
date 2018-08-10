/*
 *                            *** MIT LICENSE ***
 * -------------------------------------------------------------------------
 * This code may be modified and distributed under the MIT license.
 * See the LICENSE file for details.
 * -------------------------------------------------------------------------
 *
 * @summary   A test for the typescript definition
 *
 * @author    Alvis HT Tang <alvis@hilbert.space>
 * @license   MIT
 * @copyright Copyright (c) 2018 - All Rights Reserved.
 * -------------------------------------------------------------------------
 */

import { Observable, Subject } from 'rxjs';

import { createLogicMiddleware } from '../';

import { Action, ArgumentAction } from '../definitions/action';
import { Logic } from '../definitions/logic';
import { Payload, Meta } from './typecheck';

//
// createLogicMiddleware
//

interface Dependency {
  depKey: string;
  depKey2?: string;
}

// @ts-ignore
const dependency: Dependency = undefined;

// @ts-ignore
const logicArray: Logic[] = undefined;

{
  const middleware = createLogicMiddleware();
  middleware({});
}

{
  const middleware = createLogicMiddleware<Dependency>(logicArray, dependency);

  {
    middleware.whenComplete(() => {});
    middleware.whenComplete().then(() => {});
    middleware.whenComplete(() => {}).then(() => {});
  }

  {
    type Message = {
      action?:
        | 'op'
        | 'top'
        | 'bottom'
        | 'begin'
        | 'nesxPartial<t'
        | 'nextDisp'
        | 'nextError'
        | 'filtered'
        | 'cancelled'
        | 'dispatch'
        | 'dispCancelled'
        | 'end';
      name?: string;
      nextAction?: Action;
      shouldProcess?: boolean;
      dispAction?: Action;
    };
    // @ts-ignore
    const next: (action?: ArgumentAction) => Action = undefined;

    const monArr: Message[] = [];
    let monitor: Subject<Message> = middleware.monitor$;
    monitor.subscribe(x => monArr.push(x));

    const action = { type: 'type' };
    middleware({})(next)(action);
  }

  {
    const additionalDeps = {
      depKey2: 'string'
    };

    middleware.addDeps(additionalDeps);
  }

  middleware.addLogic(logicArray);
  middleware.mergeNewLogic(logicArray);
  middleware.replaceLogic(logicArray);
}

{
  // @ts-ignore
  const dispatch: (action: Action) => Action = undefined;
  const next = () => {};

  const middleware = createLogicMiddleware(logicArray);
  const storeFn = middleware({ dispatch })(next);

  {
    // @ts-ignore
    const simpleAction: Action<'type'> = undefined;
    // @ts-ignore
    const fullAction: Action<'type', Payload, Meta> = undefined;

    storeFn(simpleAction);
    storeFn(fullAction);
  }

  {
    Observable.merge(
      // fast 0, 1, 2
      Observable.interval(10)
        .take(3)
        .map(x => ({ meta: { fast: x } })),
      Observable.interval(60)
        .take(4)
        .delay(40)
        .map(x => ({ meta: { slow: x } }))
    ).subscribe(x => {
      storeFn({
        ...x,
        type: 'type'
      });
    });
  }
}

//
// EXPECT ERROR
//

// {
//   const middleware = createLogicMiddleware({});
// }
